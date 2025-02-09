const { useState, useEffect, useRef } = React;


const Icon = ( { name, className = "" } ) => {
    return (
        <i
            className={`fa fa-${name} ${className}`}
        />
    );
};


// Component Templates
const componentTemplates = {
    header:          {
        name:     'Header',
        icon:     'arrows-up-to-line',
        template: '<header class="header py-4">Header content</header>'
    },
    nav:             {
        name:     'Navigation',
        icon:     'ellipsis',
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
        icon:     'rectangle-list',
        template: `<div class="hero bg-primary text-white py-5">
            <div class="container">
            <div class="row">
<div class="col-md-6 text-center py-5">
    <h1>Hero Title</h1>
    <p class="lead">Hero description text</p>
</div>
<div class="col-md-6">
    <img src="https://place-hold.it/500x400" class="img-fluid" alt="Placeholder" />
</div>
            </div>
            </div>
        </div>`
    },
    footer:          {
        name:     'Footer',
        icon:     'arrows-down-to-line',
        template: `<footer class="footer py-4 bg-dark text-white">
            <div class="container">
                <span class="text-muted">Footer content</span>
            </div>
        </footer>`
    },
    container:       {
        name:     'Container',
        icon:     'square',
        template: '<div class="container">Container content</div>'
    },
    fluid_container: {
        name:     'Fluid Container',
        icon:     'square-full',
        template: '<div class="container-fluid">Fluid Container content</div>'
    },
    section:         {
        name:     'Section',
        icon:     'bars-progress',
        template: '<section class="section">Section content</section>'
    },
    row:             {
        name:     'Row',
        icon:     'bars',
        template: '<div class="row">Row content</div>'
    },
    col:             {
        name:     'Column',
        icon:     'columns',
        template: '<div class="col">Column content</div>'
    },
    heading1:        {
        name:     'Heading 1',
        icon:     'heading',
        template: '<h1>Heading 1</h1>'
    },
    heading2:        {
        name:     'Heading 2',
        icon:     'heading',
        template: '<h2>Heading 2</h2>'
    },
    heading3:        {
        name:     'Heading 3',
        icon:     'heading',
        template: '<h3>Heading 3</h3>'
    },
    heading4:        {
        name:     'Heading 4',
        icon:     'heading',
        template: '<h4>Heading< 4/h4>'
    },
    paragraph:       {
        name:     'Paragraph',
        icon:     'paragraph',
        template: '<p>Lorem ipsum dolor sit amet</p>'
    },
    button:          {
        name:     'Button',
        icon:     'hand-pointer',
        template: '<button class="btn btn-primary">Button</button>'
    },
    image:           {
        name:     'Image',
        icon:     'image',
        template: '<img src="https://place-hold.it/300x200" class="img-fluid" alt="Placeholder" />'
    },
    list:            {
        name:     'List Group',
        icon:     'list',
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
        icon:     'triangle-exclamation',
        template: '<div class="alert alert-primary">Alert message</div>'
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
                                    <i className="fa fa-clipboard" />
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

const ComponentWrapper = ( {
                               component,
                               onRemove,
                               onEdit,
                               onDrop,
                               index,
                               path,
                               moveComponent
                           } ) => {
    const [ isEditing, setIsEditing ]     = useState( false );
    const [ editContent, setEditContent ] = useState( component.content );
    const elementRef                      = useRef( null );
    const isNestable                      = nestableComponents[ component.type ];

    const handleDragStart = ( e ) => {
        e.stopPropagation();
        e.dataTransfer.setData( 'text/plain', JSON.stringify( {
            sourcePath: path,
        } ) );
        if ( elementRef.current ) {
            elementRef.current.style.opacity = '0.5';
        }
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
            const data = e.dataTransfer.getData( 'text/plain' );
            // Only parse if we have data
            if ( data ) {
                const parsedData = JSON.parse( data );
                onDrop( parsedData, [ ...path, 'children' ] );
            } else {
                // Handle drops from the component palette
                onDrop( {}, [ ...path, 'children' ] );
            }
        } catch ( error ) {
            console.warn( 'Drop parsing error:', error );
            onDrop( {}, [ ...path, 'children' ] );
        }
    };

    useEffect( () => {
        return () => {
            const icons = document.querySelectorAll( `[data-lucide="${componentTemplates[ component.type ].icon}"]` );
            icons.forEach( icon => {
                // const svg = icon.querySelector( 'svg' );
                // if ( svg && svg.parentNode ) {
                //     //svg.parentNode.removeChild( svg );
                // }
            } );
        };
    }, [ component.type ] );

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
                    <i className="move-up fa fa-sort-up me-2" />
                    <i className="move-down fa fa-sort-down me-2" />
                    <span className="block-title">{componentTemplates[ component.type ].name}</span>
                </span>
                <div>
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setIsEditing( !isEditing )}
                    >
                       <i className="fa fa-code"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-primary me-2">
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemove( path )}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div className="mt-3">
                    <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={( e ) => setEditContent( e.target.value )}
                        rows="20"
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
};

function App() {
    const [ components, setComponents ]             = useState( [] );
    const [ draggedComponent, setDraggedComponent ] = useState( null );
    const [ showPreview, setShowPreview ]           = useState( false );
    const [ showExport, setShowExport ]             = useState( false );

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

    const handleDrop = ( e, targetPath ) => {
        e.preventDefault();
        e.stopPropagation();

        // Remove any highlight classes
        document.querySelectorAll( '.drag-over' ).forEach( el => {
            el.classList.remove( 'drag-over' );
        } );

        setComponents( prevComponents => {
            // If dragging from palette
            if ( draggedComponent ) {
                const newComponent = {
                    id:       Date.now(),
                    type:     draggedComponent,
                    content:  componentTemplates[ draggedComponent ].template,
                    children: []
                };

                // For root level drops
                if ( !targetPath || targetPath.length === 0 ) {
                    return [ ...prevComponents, newComponent ];
                }

                // For nested drops, create a new copy of the state
                const newState = JSON.parse( JSON.stringify( prevComponents ) );
                let current    = newState;

                // Navigate to the correct position
                for ( let i = 0; i < targetPath.length - 1; i++ ) {
                    if ( !current[ targetPath[ i ] ] ) {
                        return prevComponents; // Invalid path, return unchanged
                    }
                    if ( !current[ targetPath[ i ] ].children ) {
                        current[ targetPath[ i ] ].children = [];
                    }
                    current = current[ targetPath[ i ] ].children;
                }

                // Insert at the specified position
                const lastIndex = targetPath[ targetPath.length - 1 ];
                if ( Array.isArray( current ) ) {
                    current.splice( lastIndex, 0, newComponent );
                }

                return newState;
            }

            // If moving an existing component
            try {
                const dragData = e.dataTransfer.getData( 'text/plain' );
                if ( !dragData ) return prevComponents;

                const { sourcePath } = JSON.parse( dragData );
                if ( !sourcePath ) return prevComponents;

                // Create a deep copy of the current state
                const newState = JSON.parse( JSON.stringify( prevComponents ) );

                // Get the component being moved
                const sourceComponent = getComponentAtPath( prevComponents, sourcePath );
                if ( !sourceComponent ) return prevComponents;

                // Remove from original position
                removeComponentAtPath( newState, sourcePath );

                // Insert at new position
                if ( !targetPath || targetPath.length === 0 ) {
                    newState.push( sourceComponent );
                } else {
                    let current = newState;
                    for ( let i = 0; i < targetPath.length - 1; i++ ) {
                        if ( !current[ targetPath[ i ] ].children ) {
                            current[ targetPath[ i ] ].children = [];
                        }
                        current = current[ targetPath[ i ] ].children;
                    }
                    const lastIndex = targetPath[ targetPath.length - 1 ];
                    current.splice( lastIndex, 0, sourceComponent );
                }

                return newState;
            } catch ( error ) {
                console.error( 'Drop handling error:', error );
                return prevComponents;
            }
        } );

        // Reset dragged component
        setDraggedComponent( null );
    };

    const getComponentAtPath = ( components, path ) => {
        let current = components;
        for ( let i = 0; i < path.length; i++ ) {
            if ( !current[ path[ i ] ] ) return null;
            current = current[ path[ i ] ];
        }
        return current;
    };

    // Helper function to remove component at path
    const removeComponentAtPath = ( components, path ) => {
        let current = components;
        for ( let i = 0; i < path.length - 1; i++ ) {
            if ( !current[ path[ i ] ] ) return;
            current = current[ path[ i ] ].children;
        }
        current.splice( path[ path.length - 1 ], 1 );
    };

    const insertAtPath = ( components, path, component ) => {
        try {
            let newComponents = [ ...components ];
            if ( path.length === 1 ) {
                newComponents.splice( path[ 0 ], 0, component );
                return newComponents;
            }

            let current = newComponents;
            for ( let i = 0; i < path.length - 2; i += 2 ) {
                if ( !current[ path[ i ] ].children ) {
                    current[ path[ i ] ].children = [];
                }
                current = current[ path[ i ] ].children;
            }

            const lastIndex = path[ path.length - 1 ];
            if ( Array.isArray( current ) ) {
                current.splice( lastIndex, 0, component );
            }

            return newComponents;
        } catch ( error ) {
            console.error( 'Error in insertAtPath:', error );
            return components;
        }
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
                        onDragEnd={() => setDraggedComponent( null )}
                    >
                       <Icon name={info.icon} />
                        {info.name}
                    </div>
                ) )}
            </div>

            <div className="builder-content">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Bootstrap 5 Layout Builder</h2>
                    <div className="main-actions">
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setShowPreview( true )}
                        >
                            <i className="fa fa-eye"></i> Preview
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowExport( true )}
                        >
                            <i className="fa fa-code"></i> Export
                        </button>
                    </div>
                </div>

                <div
                    className={`dropzone ${components.length === 0 ? 'empty-canvas' : ''}`}
                    onDragOver={( e ) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.add( 'active' );
                    }}
                    onDragLeave={( e ) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove( 'active' );
                    }}
                    onDrop={( e ) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove( 'active' );

                        // If dragging from palette
                        if ( draggedComponent ) {
                            setComponents( prev => [ ...prev, {
                                id:       Date.now(),
                                type:     draggedComponent,
                                content:  componentTemplates[ draggedComponent ].template,
                                children: []
                            } ] );
                            setDraggedComponent( null );
                            return;
                        }

                        // If moving an existing component
                        try {
                            const data = e.dataTransfer.getData( 'text/plain' );
                            if ( !data ) return;

                            const { sourcePath } = JSON.parse( data );
                            if ( !sourcePath ) return;

                            setComponents( prev => {
                                const newComponents      = [ ...prev ];
                                const [ sourceIndex ]    = sourcePath;
                                const [ movedComponent ] = newComponents.splice( sourceIndex, 1 );
                                newComponents.push( movedComponent );
                                return newComponents;
                            } );
                        } catch ( error ) {
                            console.error( 'Drop handling error:', error );
                        }
                    }}
                >
                    {components.length === 0 ? (
                        <>
                            <i className="fa fa-plus-circle" />
                            <p>Drag components here</p>
                        </>
                    ) : (
                         components.map( ( component, index ) => (
                             <ComponentWrapper
                                 key={component.id}
                                 component={component}
                                 onRemove={( path ) => {
                                     setComponents( prev => {
                                         const newComponents = [ ...prev ];
                                         const [ index ]     = path;
                                         newComponents.splice( index, 1 );
                                         return newComponents;
                                     } );
                                 }}
                                 onEdit={( path, content ) => {
                                     setComponents( prev => {
                                         const newComponents    = [ ...prev ];
                                         const [ index ]        = path;
                                         newComponents[ index ] = {
                                             ...newComponents[ index ],
                                             content
                                         };
                                         return newComponents;
                                     } );
                                 }}
                                 onDrop={( e, targetPath ) => {
                                     e.preventDefault();
                                     e.stopPropagation();

                                     // If dragging from palette
                                     if ( draggedComponent ) {
                                         setComponents( prev => {
                                             const newComponents                    = [ ...prev ];
                                             const [ parentIndex, , childrenIndex ] = targetPath;

                                             if ( !newComponents[ parentIndex ].children ) {
                                                 newComponents[ parentIndex ].children = [];
                                             }

                                             newComponents[ parentIndex ].children.splice( childrenIndex, 0, {
                                                 id:       Date.now(),
                                                 type:     draggedComponent,
                                                 content:  componentTemplates[ draggedComponent ].template,
                                                 children: []
                                             } );

                                             return newComponents;
                                         } );
                                         setDraggedComponent( null );
                                         return;
                                     }

                                     // If moving existing component
                                     try {
                                         const data = e.dataTransfer.getData( 'text/plain' );
                                         if ( !data ) return;

                                         const { sourcePath } = JSON.parse( data );
                                         if ( !sourcePath ) return;

                                         setComponents( prev => {
                                             const newComponents      = [ ...prev ];
                                             const [ sourceIndex ]    = sourcePath;
                                             const [ movedComponent ] = newComponents.splice( sourceIndex, 1 );

                                             const [ parentIndex, , childrenIndex ] = targetPath;
                                             if ( !newComponents[ parentIndex ].children ) {
                                                 newComponents[ parentIndex ].children = [];
                                             }
                                             newComponents[ parentIndex ].children.splice( childrenIndex, 0, movedComponent );

                                             return newComponents;
                                         } );
                                     } catch ( error ) {
                                         console.error( 'Drop handling error:', error );
                                     }
                                 }}
                                 index={index}
                                 path={[ index ]}
                             />
                         ) )
                     )}
                </div>

                {showPreview && (
                    <PreviewModal
                        html={generateHTML( components )}
                        onClose={() => setShowPreview( false )}
                    />
                )}
                {showExport && (
                    <ExportModal
                        html={generateHTML( components )}
                        onClose={() => setShowExport( false )}
                    />
                )}
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render( <App /> );