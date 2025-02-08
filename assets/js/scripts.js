const componentTemplates = {
    container: {
        name:     'Container',
        icon:     'Box',
        template: '<div class="container">Container content</div>'
    },
    row:       {
        name:     'Row',
        icon:     'Layout',
        template: '<div class="row">Row content</div>'
    },
    col:       {
        name:     'Column',
        icon:     'Columns',
        template: '<div class="col">Column content</div>'
    },
    heading:   {
        name:     'Heading',
        icon:     'Type',
        template: '<h2>Heading</h2>'
    },
    paragraph: {
        name:     'Paragraph',
        icon:     'AlignLeft',
        template: '<p>Lorem ipsum dolor sit amet</p>'
    },
    button:    {
        name:     'Button',
        icon:     'Square',
        template: '<button class="btn btn-primary">Button</button>'
    },
    card:      {
        name:     'Card',
        icon:     'CreditCard',
        template: `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Card content</p>
                        </div>
                    </div>
                `
    },
    alert:     {
        name:     'Alert',
        icon:     'AlertTriangle',
        template: '<div class="alert alert-primary">Alert message</div>'
    }
};

function App() {
    const [ components, setComponents ]             = React.useState( [] );
    const [ draggedComponent, setDraggedComponent ] = React.useState( null );
    const [ showPreview, setShowPreview ]           = React.useState( false );
    const [ showExport, setShowExport ]             = React.useState( false );

    const handleDragStart = ( componentType ) => {
        setDraggedComponent( componentType );
    };

    const handleDrop = ( e ) => {
        e.preventDefault();
        if ( draggedComponent ) {
            const newComponent = {
                id:      Date.now(),
                type:    draggedComponent,
                content: componentTemplates[ draggedComponent ].template
            };
            setComponents( [ ...components, newComponent ] );
            setDraggedComponent( null );
        }
    };

    const handleDragOver = ( e ) => {
        e.preventDefault();
        e.currentTarget.classList.add( 'active' );
    };

    const handleDragLeave = ( e ) => {
        e.currentTarget.classList.remove( 'active' );
    };

    const removeComponent = ( id ) => {
        setComponents( components.filter( c => c.id !== id ) );
    };

    const editComponent = ( id, newContent ) => {
        setComponents( components.map( c =>
            c.id === id ? { ...c, content: newContent } : c
        ) );
    };

    const moveComponent = ( dragIndex, hoverIndex ) => {
        const newComponents   = [ ...components ];
        const [ draggedItem ] = newComponents.splice( dragIndex, 1 );
        newComponents.splice( hoverIndex, 0, draggedItem );
        setComponents( newComponents );
    };

    const generateHTML = () => {
        return components.map( c => c.content ).join( '\n' );
    };

    return (
        <div className="d-flex">
            <div className="components-sidebar">
                <h4 className="mb-4">Components</h4>
                {Object.entries( componentTemplates ).map( ( [ type, info ] ) => (
                    <div
                        key={type}
                        className="component-item"
                        draggable
                        onDragStart={() => handleDragStart( type )}
                    >
                        <i data-lucide={info.icon}></i>
                        {info.name}
                    </div>
                ) )}
            </div>

            <div className="builder-content">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Layout Builder</h2>
                    <div>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setShowPreview( true )}
                        >
                            <i data-lucide="Eye"></i> Preview
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowExport( true )}
                        >
                            <i data-lucide="Code"></i> Export
                        </button>
                    </div>
                </div>

                <div
                    className={`dropzone ${components.length === 0 ? 'empty-canvas' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {components.length === 0 ? (
                        <>
                            <i data-lucide="PlusCircle" className="mb-2"></i>
                            <p>Drag components here</p>
                        </>
                    ) : (
                         components.map( ( component, index ) => (
                             <ComponentWrapper
                                 key={component.id}
                                 component={component}
                                 onRemove={removeComponent}
                                 onEdit={editComponent}
                                 index={index}
                                 moveComponent={moveComponent}
                             />
                         ) )
                     )}
                </div>

                {/* Preview Modal */}
                {showPreview && (
                    <PreviewModal
                        html={generateHTML()}
                        onClose={() => setShowPreview( false )}
                    />
                )}

                {/* Export Modal */}
                {showExport && (
                    <ExportModal
                        html={generateHTML()}
                        onClose={() => setShowExport( false )}
                    />
                )}
            </div>
        </div>
    );
}

function ComponentWrapper( { component, onRemove, onEdit, index, moveComponent } ) {
    const [ isEditing, setIsEditing ]     = React.useState( false );
    const [ editContent, setEditContent ] = React.useState( component.content );

    const handleSave = () => {
        onEdit( component.id, editContent );
        setIsEditing( false );
    };

    const dragRef = React.useRef( null );

    const handleDragStart = ( e ) => {
        e.dataTransfer.setData( 'text/plain', index );
    };

    const handleDragOver = ( e ) => {
        e.preventDefault();
        const draggedIndex = parseInt( e.dataTransfer.getData( 'text/plain' ) );
        if ( draggedIndex !== index ) {
            moveComponent( draggedIndex, index );
        }
    };

    return (
        <div
            className="component-wrapper"
            ref={dragRef}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
        >
            <div className="component-header">
                <span>
                    <i data-lucide={componentTemplates[ component.type ].icon}></i>
                    {componentTemplates[ component.type ].name}
                </span>
                <div>
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setIsEditing( !isEditing )}
                    >
                        <i data-lucide="Edit2"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemove( component.id )}
                    >
                        <i data-lucide="Trash2"></i>
                    </button>
                </div>
            </div>
            {isEditing ? (
                <div>
                            <textarea
                                className="form-control mb-2"
                                value={editContent}
                                onChange={( e ) => setEditContent( e.target.value )}
                                rows="3"
                            />
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                 <div dangerouslySetInnerHTML={{ __html: component.content }} />
             )}
        </div>
    );
}

function PreviewModal( { html, onClose } ) {
    return (
        <div className="modal preview-modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Preview</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExportModal( { html, onClose } ) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText( html );
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Export HTML</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="export-code">{html}</div>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={copyToClipboard}
                        >
                            <i data-lucide="Clipboard"></i> Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Initialize Lucide icons after each render
React.useEffect( () => {
    lucide.createIcons();
} );

// Render the app
const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render( <App /> );