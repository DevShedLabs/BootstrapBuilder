const { useState, useEffect, useRef } = React;

const Icon = ({ name, className = "" }) => {
    const iconRef = useRef(null);

    useEffect(() => {
        if (iconRef.current) {
            lucide.createIcons({
                elements: [iconRef.current]
            });
        }
    }, [name]);

    return (
        <i ref={iconRef} data-lucide={name} className={`lucide lucide-${name} ${className}`}></i>
    );
};

// Component Templates
const componentTemplates = {
    container:       {
        name:     'Container',
        icon:     'square',
        template: '<div class="container">Container content</div>'
    },
    fluid_container: {
        name:     'Fluid Container',
        icon:     'rectangle-horizontal',
        template: '<div class="container-fluid">Fluid Container content</div>'
    },
    section:         {
        name:     'Section',
        icon:     'rows',
        template: '<section class="section">Section content</section>'
    },
    header:          {
        name:     'Header',
        icon:     'panel-top',
        template: '<header class="header py-4">Header content</header>'
    },
    nav:             {
        name:     'Navigation',
        icon:     'navigation',
        template: `<nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Home</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`
    },
    hero:            {
        name:     'Hero Section',
        icon:     'layout-template',
        template: `<div class="hero bg-primary text-white py-5">
            <div class="container">
                <h1>Hero Title</h1>
                <p class="lead">Hero description text</p>
            </div>
        </div>`
    },
    row:             {
        name:     'Row',
        icon:     'rows-3',
        template: '<div class="row">Row content</div>'
    },
    col:             {
        name:     'Column',
        icon:     'columns',
        template: '<div class="col">Column content</div>'
    },
    heading1:         {
        name:     'Heading 1',
        icon:     'heading-1',
        template: '<h1>Heading 1</h1>'
    },
    heading2:         {
        name:     'Heading 2',
        icon:     'heading-2',
        template: '<h2>Heading 2</h2>'
    },
    heading3:         {
        name:     'Heading 3',
        icon:     'heading-3',
        template: '<h3>Heading 3</h3>'
    },
    heading4:         {
        name:     'Heading 4',
        icon:     'heading-4',
        template: '<h4>Heading< 4/h4>'
    },
    paragraph:       {
        name:     'Paragraph',
        icon:     'pilcrow',
        template: '<p>Lorem ipsum dolor sit amet</p>'
    },
    button:          {
        name:     'Button',
        icon:     'pointer',
        template: '<button class="btn btn-primary">Button</button>'
    },
    image:           {
        name:     'Image',
        icon:     'image',
        template: '<img src="https://via.placeholder.com/300x200" class="img-fluid" alt="Placeholder" />'
    },
    list:            {
        name:     'List Group',
        icon:     'list-ordered',
        template: `<ul class="list-group">
            <li class="list-group-item">List item 1</li>
            <li class="list-group-item">List item 2</li>
            <li class="list-group-item">List item 3</li>
        </ul>`
    },
    card:            {
        name:     'Card',
        icon:     'id-card',
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
    },
    footer:          {
        name:     'Footer',
        icon:     'panel-bottom',
        template: `<footer class="footer py-4 bg-light">
            <div class="container">
                <span class="text-muted">Footer content</span>
            </div>
        </footer>`
    }
};

// Define which components can accept children
const nestableComponents = {
    container:       true,
    fluid_container: true,
    section:         true,
    row:             true,
    col:             true,
    card:            true
};

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
    const [ copySuccess, setCopySuccess ] = useState( false );

    useEffect( () => {
        // Highlight the code when the component mounts or html changes
        Prism.highlightAll();
    }, [ html ] );

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText( html );
            setCopySuccess( true );
            setTimeout( () => setCopySuccess( false ), 2000 );
        } catch ( err ) {
            console.error( 'Failed to copy:', err );
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Export HTML</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="">
                                <pre className="mb-0"><code className="language-html">
                                    {html}
                                </code></pre>
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    className={`btn ${copySuccess ? 'btn-success' : 'btn-primary'}`}
                                    onClick={copyToClipboard}
                                >
                                    <Icon name="clipboard" className="action-icon" />
                                    {copySuccess ? ' Copied!' : ' Copy to Clipboard'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function ComponentWrapper( {
                               component,
                               onRemove,
                               onEdit,
                               onDrop,
                               index,
                               path,
                               moveComponent
                           } ) {
    const [ isEditing, setIsEditing ]     = useState( false );
    const [ editContent, setEditContent ] = useState( component.content );
    const elementRef                      = useRef( null );
    const isNestable                      = nestableComponents[ component.type ];

    const handleDragStart = ( e ) => {
        e.stopPropagation();
        e.dataTransfer.setData( 'text/plain', JSON.stringify( { index, path } ) );
        elementRef.current.style.opacity = '0.5';
    };

    const handleDragEnd = () => {
        if ( elementRef.current ) {
            elementRef.current.style.opacity = '1';
        }
    };

    const handleDragOver = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        if ( isNestable ) {
            e.currentTarget.classList.add( 'drag-over' );
        }
    };

    const handleDragLeave = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove( 'drag-over' );
    };

    const handleDrop = ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove( 'drag-over' );

        if ( !isNestable ) return;

        try {
            const dataTransfer = e.dataTransfer.getData( 'text/plain' );
            // Only try to parse if there's actually data
            const data         = dataTransfer ? JSON.parse( dataTransfer ) : {};
            onDrop( data, [ ...path, 'children' ] );
        } catch ( error ) {
            console.warn( 'Drop parsing error:', error );
            // Still allow the drop even if parsing fails
            onDrop( {}, [ ...path, 'children' ] );
        }
    };

    useEffect( () => {
        setEditContent( component.content );
    }, [ component.content ] );

    return (
        <div
            ref={elementRef}
            className={`component-wrapper ${isNestable ? 'nestable' : ''}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="component-header">
                <span className="d-flex align-items-center">
                    <Icon name="grip-vertical" className="me-2" />
                    <Icon name={componentTemplates[ component.type ].icon} className="component-icon" />
                    {componentTemplates[ component.type ].name}
                </span>
                <div>
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setIsEditing( !isEditing )}
                    >
                        <Icon name="pencil" />
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemove( path )}
                    >
                        <Icon name="trash" />
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
                                onEdit( path, editContent );
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
                     {component.children && component.children.map( ( child, idx ) => (
                         <ComponentWrapper
                             key={child.id}
                             component={child}
                             onRemove={onRemove}
                             onEdit={onEdit}
                             onDrop={onDrop}
                             index={idx}
                             path={[ ...path, 'children', idx ]}
                             moveComponent={moveComponent}
                         />
                     ) )}
                 </div>
             )}
        </div>
    );
}

function App() {
    const [ components, setComponents ]             = useState( [] );
    const [ draggedComponent, setDraggedComponent ] = useState( null );
    const [ showPreview, setShowPreview ]           = useState( false );
    const [ showExport, setShowExport ]             = useState( false );

    const removeComponentAtPath = ( components, path ) => {
        if ( path.length === 1 ) {
            return components.filter( ( _, i ) => i !== path[ 0 ] );
        }

        const [ index, ...rest ] = path;
        const newComponents      = [ ...components ];
        if ( rest[ 0 ] === 'children' ) {
            newComponents[ index ] = {
                ...newComponents[ index ],
                children: removeComponentAtPath( newComponents[ index ].children || [], rest.slice( 1 ) )
            };
        }
        return newComponents;
    };

    const updateComponentAtPath = ( components, path, newContent ) => {
        if ( path.length === 1 ) {
            return components.map( ( comp, i ) =>
                i === path[ 0 ] ? { ...comp, content: newContent } : comp
            );
        }

        const [ index, ...rest ] = path;
        const newComponents      = [ ...components ];
        if ( rest[ 0 ] === 'children' ) {
            newComponents[ index ] = {
                ...newComponents[ index ],
                children: updateComponentAtPath( newComponents[ index ].children || [], rest.slice( 1 ), newContent )
            };
        }
        return newComponents;
    };

    const handleDrop = ( sourceData, targetPath ) => {
        setComponents( prevComponents => {
            try {
                // If dragging from component palette
                if ( draggedComponent ) {
                    const newComponent = {
                        id:       Date.now(),
                        type:     draggedComponent,
                        content:  componentTemplates[ draggedComponent ].template,
                        children: []
                    };

                    // Insert at target path
                    let newComponents = [ ...prevComponents ];
                    let current       = newComponents;
                    for ( let i = 0; i < targetPath.length - 1; i += 2 ) {
                        if ( !current[ targetPath[ i ] ].children ) {
                            current[ targetPath[ i ] ].children = [];
                        }
                        current = current[ targetPath[ i ] ].children;
                    }
                    current.push( newComponent );

                    setDraggedComponent( null );
                    return newComponents;
                }

                // If moving existing component
                if ( typeof sourceData === 'string' ) {
                    try {
                        sourceData = JSON.parse( sourceData );
                    } catch ( e ) {
                        console.warn( 'Invalid source data:', e );
                        return prevComponents;
                    }
                }

                const sourcePath = sourceData.path;
                if ( !sourcePath ) {
                    return prevComponents;
                }

                // Remove from source
                let newComponents    = removeComponentAtPath( prevComponents, sourcePath );
                // Get the component being moved
                const movedComponent = getComponentAtPath( prevComponents, sourcePath );
                // Insert at target
                if ( movedComponent ) {
                    newComponents = insertAtPath( newComponents, targetPath, movedComponent );
                }

                return newComponents;
            } catch ( error ) {
                console.error( 'Drop handling error:', error );
                return prevComponents;
            }
        } );
    };

    const getComponentAtPath = ( components, path ) => {
        let current = components;
        for ( let i = 0; i < path.length; i += 2 ) {
            current = current[ path[ i ] ];
            if ( i + 1 < path.length ) {
                current = current.children;
            }
        }
        return current;
    };

    const insertAtPath = ( components, path, component ) => {
        let newComponents = [ ...components ];
        let current       = newComponents;
        for ( let i = 0; i < path.length - 1; i += 2 ) {
            current = current[ path[ i ] ].children;
        }
        current.push( component );
        return newComponents;
    };

    const generateHTML = ( components, level = 0 ) => {
        return components.map( component => {
            const indent = '\t'.repeat( level );
            let html     = component.content;

            // Find the first closing bracket to split opening tag
            const openTagEnd = html.indexOf( '>' ) + 1;
            const openingTag = html.slice( 0, openTagEnd );

            // Find where the closing tag starts
            const closingTagIndex = html.lastIndexOf( '</' );
            const closingTag      = html.slice( closingTagIndex );

            // Get the content between tags
            let content = html.slice( openTagEnd, closingTagIndex ).trim();

            if ( component.children && component.children.length > 0 ) {
                // Replace existing content with formatted children
                content = '\n' + generateHTML( component.children, level + 1 ) + '\n' + indent;
            } else if ( content ) {
                // If there's content but no children, add proper indentation
                content = content ? '\n' + '\t'.repeat( level + 1 ) + content + '\n' + indent : '';
            }

            return indent + openingTag + content + closingTag;
        } ).join( '\n' );
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
                        onDragStart={() => setDraggedComponent( type )}
                    >
                        <Icon name={info.icon} className="component-icon" />
                        {info.name}
                    </div>
                ) )}
            </div>

            <div className="builder-content">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Bootstrap 5 Layout Builder</h2>
                    <div className="main-actions">
                        <button className="btn btn-secondary me-2" onClick={() => setShowPreview( true )}>
                            <Icon name="eye" /> Preview
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowExport( true )}>
                            <Icon name="code" /> Export
                        </button>
                    </div>
                </div>

                <div
                    className={`dropzone ${components.length === 0 ? 'empty-canvas' : ''}`}
                    onDragOver={( e ) => {
                        e.preventDefault();
                        e.currentTarget.classList.add( 'active' );
                    }}
                    onDragLeave={( e ) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove( 'active' );
                    }}
                    onDrop={( e ) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove( 'active' );
                        handleDrop( {}, [ components.length ] );
                    }}
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
                                 onRemove={( path ) => setComponents( prev => removeComponentAtPath( prev, path ) )}
                                 onEdit={( path, content ) => setComponents( prev => updateComponentAtPath( prev, path, content ) )}
                                 onDrop={handleDrop}
                                 index={index}
                                 path={[ index ]}
                                 moveComponent={() => {
                                 }}
                             />
                         ) )
                     )}
                </div>

                {showPreview && (
                    <PreviewModal html={generateHTML( components )} onClose={() => setShowPreview( false )} />
                )}
                {showExport && (
                    <ExportModal html={generateHTML( components )} onClose={() => setShowExport( false )} />
                )}
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render( <App /> );