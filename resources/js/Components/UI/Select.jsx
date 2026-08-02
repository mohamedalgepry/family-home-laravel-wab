import React, { useState, useRef, useEffect, useId } from 'react'

export function Select({ 
    value, 
    onChange, 
    children, 
    className = '',
    disabled = false,
    required = false,
    id,
    name,
    defaultValue,
    'aria-label': ariaLabel
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const wrapperRef = useRef(null)
    const triggerRef = useRef(null)
    const searchInputRef = useRef(null)
    const generatedId = useId()
    const listboxId = `select-listbox-${id || name || generatedId}`

    // Ensure value is a string or number for comparison
    const currentValue = value !== undefined ? value : defaultValue;

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
                setFocusedIndex(-1)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Extract options from children
    const options = [];
    React.Children.forEach(children, child => {
        if (!child) return;
        
        if (Array.isArray(child)) {
            child.forEach(c => {
                if (c && c.props) {
                    options.push({
                        value: c.props.value,
                        label: c.props.children
                    });
                }
            });
        } else if (child.type === 'option' || child.props?.value !== undefined) {
            options.push({
                value: child.props.value,
                label: child.props.children
            });
        }
    });

    const filteredOptions = options.filter(opt => {
        if (!search) return true;
        const labelStr = typeof opt.label === 'string' ? opt.label : String(opt.label || '');
        return labelStr.toLowerCase().includes(search.toLowerCase());
    });

    const selectedOption = options.find(opt => String(opt.value) === String(currentValue)) || options[0];
    const showSearch = options.length > 10;

    const handleSelect = (val) => {
        if (onChange) {
            onChange({
                target: { value: val, name: name },
                preventDefault: () => {},
                stopPropagation: () => {}
            });
        }
        setIsOpen(false);
        setSearch('');
        setFocusedIndex(-1);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(0);
                } else {
                    setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(filteredOptions.length - 1);
                } else {
                    setFocusedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                }
                break;
            case 'Enter':
            case ' ':
                if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                    e.preventDefault();
                    handleSelect(filteredOptions[focusedIndex].value);
                } else if (!isOpen) {
                    e.preventDefault();
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    triggerRef.current?.focus();
                }
                break;
            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    setFocusedIndex(-1);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div 
            ref={wrapperRef} 
            className={`relative w-full ${isOpen ? 'z-[100]' : 'z-10'} ${className}`}
            onKeyDown={handleKeyDown}
        >
            {/* Hidden native select for form submissions */}
            <select 
                id={id ? `${id}-native` : (name ? `${name}-native` : undefined)}
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10" 
                value={currentValue} 
                name={name} 
                disabled={disabled}
                required={required}
                onChange={() => {}}
                tabIndex={-1}
                aria-hidden="true"
            >
                <option value=""></option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Trigger Button */}
            <button
                id={id || name}
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-label={ariaLabel || (typeof selectedOption?.label === 'string' ? selectedOption.label : 'Select option')}
                className={`w-full h-full min-h-[40px] px-3 py-1.5 bg-surface border border-transparent rounded-xl text-sm transition-all duration-200 outline-none flex items-center justify-between focus:ring-2 focus:ring-primary-500 focus:border-primary-900 focus:bg-white hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? 'bg-white border-primary-900 ring-2 ring-primary-500' : ''}`}
                style={{ textAlign: 'start' }}
            >
                <span className={`truncate text-[14px] ${!selectedOption?.value && selectedOption?.value !== 0 ? 'text-secondary-500' : 'text-secondary-900 font-medium'}`}>
                    {selectedOption ? selectedOption.label : 'Select...'}
                </span>
                
                {/* Custom Arrow */}
                <svg 
                    className={`w-4 h-4 text-secondary-500 transition-transform duration-200 shrink-0 ms-3 ${isOpen ? 'rotate-180 text-primary-900' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <div 
                className={`absolute z-[100] top-full left-0 right-0 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-secondary-200 flex flex-col origin-top transition-all duration-200 ease-out min-w-[160px] ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
                style={{ maxHeight: '300px' }}
            >
                {/* Search Box */}
                {showSearch && (
                    <div className="p-3 border-b border-secondary-100 shrink-0 bg-white rounded-t-2xl">
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none rtl:right-3 rtl:left-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                aria-label="Filter options"
                                className="w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 bg-secondary-50 border border-transparent rounded-xl text-sm text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-900 transition-all outline-none"
                                onClick={(e) => e.stopPropagation()} 
                            />
                        </div>
                    </div>
                )}

                {/* Options List with role="listbox" */}
                <div 
                    id={listboxId}
                    role="listbox"
                    tabIndex={-1}
                    aria-label={ariaLabel || 'Options'}
                    className="overflow-y-auto p-2 custom-scrollbar"
                >
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-6 text-sm text-secondary-500 text-center font-medium" role="option" aria-selected="false">
                            No results found
                        </div>
                    ) : (
                        filteredOptions.map((opt, idx) => {
                            const isSelected = String(opt.value) === String(currentValue)
                            const isKeyboardFocused = idx === focusedIndex

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelect(opt.value);
                                    }}
                                    className={`w-full text-start px-4 py-3 rounded-xl text-[15px] transition-colors duration-150 flex items-center justify-between mb-1 last:mb-0 outline-none focus:ring-2 focus:ring-primary-500 ${
                                        isSelected 
                                            ? 'bg-primary-900/10 text-primary-900 font-semibold' 
                                            : isKeyboardFocused 
                                                ? 'bg-secondary-100 text-secondary-900 font-medium'
                                                : 'text-secondary-800 hover:bg-secondary-50'
                                    }`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && (
                                        <svg className="w-5 h-5 text-primary-900 shrink-0 ms-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
