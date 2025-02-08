const { useState, useEffect, useRef } = React;

// Icon component
const Icon = ( { name, className = "" } ) => {
    const iconRef = useRef();

    useEffect( () => {
        if ( iconRef.current ) {
            lucide.createIcons( {
                elements: [ iconRef.current ]
            } );
        }
    }, [ name ] );

    return <i ref={iconRef} data-lucide={name} className={className}></i>;
};

// Component Templates
const componentTemplates = {
    container:       {
        name:     'Container',
        icon:     'box',
        template: '<div class="container">Container content</div>'
    },
    fluid_container: {
        name:     'Fluid Container',
        icon:     'box',
        template: '<div class="container-fluid">Fluid Container content</div>'
    },
    section:         {
        name:     'Section',
        icon:     'box',
        template: '<section class="section">Section content</section>'
    },
    row:             {
        name:     'Row',
        icon:     'layout',
        template: '<div class="row">Row content</div>'
    },
    col:             {
        name:     'Column',
        icon:     'columns',
        template: '<div class="col">Column content</div>'
    },
    heading:         {
        name:     'Heading',
        icon:     'type',
        template: '<h2>Heading</h2>'
    },
    paragraph:       {
        name:     'Paragraph',
        icon:     'align-left',
        template: '<p>Lorem ipsum dolor sit amet</p>'
    },
    button:          {
        name:     'Button',
        icon:     'square',
        template: '<button class="btn btn-primary">Button</button>'
    },
    card:            {
        name:     'Card',
        icon:     'credit-card',
        template: `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Card content</p>
                </div>
            </div>
        `
    },
    alert:           {
        name:     'Alert',
        icon:     'alert-triangle',
        template: '<div class="alert alert-primary">Alert message</div>'
    }
};

function ComponentWrapper( { component, onRemove, onEdit, index, moveComponent } ) {
    const [ isEditing, setIsEditing ]     = useState( false );
    const [ editContent, setEditContent ] = useState( component.content );
    const elementRef                      = useRef( null );

    const handleDragStart = ( e ) => {
        e.stopPropagation();
        e.dataTransfer.setData( 'text/plain', index.toString() );
        e.dataTransfer.effectAllowed = 'move';

        setTimeout( () => {
            if ( elementRef.current ) {
                elementRef.current.style.opacity = '0.5';
            }
        }, 0 );
    };

    const handleDragEnd = () => {
        if ( elementRef.current ) {
            elementRef.current.style.opacity = '1';
        }
    };

    const handleDragOver = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        const dragIndex = parseInt( e.dataTransfer.getData( 'text/plain' ) );
        if ( dragIndex !== index ) {
            moveComponent( dragIndex, index );
        }
    };

    useEffect( () => {
        setEditContent( component.content );
    }, [ component.content ] );

    return (
        <div
            ref={elementRef}
            className="component-wrapper"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="component-header">
                <span className="d-flex align-items-center">
                    <Icon name="grip" className="handle-icon me-2" />
                    <Icon name={componentTemplates[ component.type ].icon} className="component-icon" />
                    {componentTemplates[ component.type ].name}
                </span>
                <div>
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setIsEditing( !isEditing )}
                    >
                        <Icon name="edit-2" className="action-icon" />
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemove( component.id )}
                    >
                        <Icon name="trash-2" className="action-icon" />
                    </button>
                </div>
            </div>
            {isEditing ? (
                <div className="mt-3">
                    <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={( e ) => setEditContent( e.target.value )}
                        rows="3"
                    />
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                onEdit( component.id, editContent );
                                setIsEditing( false );
                            }}
                        >
                            Save Changes
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                setEditContent( component.content );
                                setIsEditing( false );
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                 <div className="component-content mt-2">
                     <div dangerouslySetInnerHTML={{ __html: component.content }} />
                 </div>
             )}
        </div>
    );
}

function PreviewModal( { html, onClose } ) {
    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal preview-modal show d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Preview</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function ExportModal( { html, onClose } ) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText( html );
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Export HTML</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="export-code">{html}</div>
                            <button className="btn btn-primary mt-3" onClick={copyToClipboard}>
                                <Icon name="clipboard" className="action-icon" /> Copy to Clipboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function App() {
    const [ components, setComponents ]             = useState( [] );
    const [ draggedComponent, setDraggedComponent ] = useState( null );
    const [ showPreview, setShowPreview ]           = useState( false );
    const [ showExport, setShowExport ]             = useState( false );

    useEffect( () => {
        lucide.createIcons( {
            elements: document.querySelectorAll( '[data-lucide]' )
        } );
    }, [ components, showPreview, showExport ] );

    const handleDragStart = ( componentType ) => {
        setDraggedComponent( componentType );
    };

    const handleDrop = ( e ) => {
        e.preventDefault();
        e.currentTarget.classList.remove( 'active' );

        if ( draggedComponent ) {
            setComponents( prevComponents => [
                ...prevComponents,
                {
                    id:      Date.now(),
                    type:    draggedComponent,
                    content: componentTemplates[ draggedComponent ].template
                }
            ] );
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
        setComponents( prevComponents => prevComponents.filter( c => c.id !== id ) );
    };

    const editComponent = ( id, newContent ) => {
        setComponents( prevComponents =>
            prevComponents.map( c => c.id === id ? { ...c, content: newContent } : c )
        );
    };

    const moveComponent = ( dragIndex, hoverIndex ) => {
        setComponents( prevComponents => {
            const newComponents = [ ...prevComponents ];
            const [ removed ]   = newComponents.splice( dragIndex, 1 );
            newComponents.splice( hoverIndex, 0, removed );
            return newComponents;
        } );
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
                        <Icon name={info.icon} className="component-icon" />
                        {info.name}
                    </div>
                ) )}
            </div>

            <div className="builder-content">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Bootstrap 5 Layout Builder</h2>
                    <div>
                        <button className="btn btn-secondary me-2" onClick={() => setShowPreview( true )}>
                            <Icon name="eye" className="action-icon" /> Preview
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowExport( true )}>
                            <Icon name="code" className="action-icon" /> Export
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
                            <Icon name="plus-circle" className="empty-canvas-icon" />
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

                {showPreview && (
                    <PreviewModal html={generateHTML()} onClose={() => setShowPreview( false )} />
                )}
                {showExport && (
                    <ExportModal html={generateHTML()} onClose={() => setShowExport( false )} />
                )}
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render( <App /> );