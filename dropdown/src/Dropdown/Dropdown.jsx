import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Checkbox } from '../Checkbox';
import './style.css'

export function Dropdown({
    isMultiSelect = false,
    labelName,
    options,
    defaultValues,
    customHandleDropdownMenuSelect,
    customOnBlur,
    isMenuDefaultOpen = false,
    ExpandIcon = ChevronRightIcon,
    customExpandIconClassNames = '',
    containerClassName = '',
    labelNameClassName = ''
}) {  
    const [isMenuOpen, setIsMenuOpen] = useState(isMenuDefaultOpen);
    const [currentValues, setCurrentValues] = useState(defaultValues ?? [])

    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                if (customOnBlur) {
                    customOnBlur(currentValues)
                }
                setIsMenuOpen(false);
            }
        }

        window.addEventListener('mousedown', handleClick);

        return document.removeEventListener('mousedown', handleClick);
    }, [ref, currentValues, customOnBlur])

    const handleCloseMenu = (e) => {
        setIsMenuOpen((prev) => !prev);
    }

    const currentOptionsByValue = (() => {
        const optionsByValue = {};
        
        for (const option of currentValues) {
            optionsByValue[option.value] = option
        }

        return optionsByValue;
    })()

    const allOptionsByValue = (() => {
        const optionsByValue = {}

        options.forEach((option, index) => {
            optionsByValue[option.value] = {option, index}
        })

        return optionsByValue
    })()

    const handleDropdownMenuSelect = (option) => {
        if (customHandleDropdownMenuSelect) {
            customHandleDropdownMenuSelect(option)
        }

        if (!isMultiSelect) {
            if (currentOptionsByValue[option.value]) {
                setCurrentValues([]);
            } else {
                setCurrentValues([option]);
            }
        } else {
            if (currentOptionsByValue[option.value]) {
                setCurrentValues((prev) => prev.filter((prevOption) => prevOption.value !== option.value))
            } else {
                setCurrentValues((prev) => [...prev, option].sort((a, b) => allOptionsByValue[a.value].index - allOptionsByValue[b.value].index))
            }
        }

    }

    const renderDropdownOptions = options.map((option) => {
        const isSelected = !!currentOptionsByValue[option.value]
        return <Dropdown.MenuItem 
            key={option.value}
            onSelect={handleDropdownMenuSelect}
            isMultiSelect={isMultiSelect}
            option={option}
            isSelected={isSelected}
        />
    })

    const renderDropdownValues = () => {
        if (currentValues.length === 0) {
            return null;
        }

        if (isMultiSelect) {
            return currentValues.map((option, index) => {
                if (index === (currentValues.length - 1)) {
                    return <div key={index}>{option.name}</div>;
                }

                return <div key={index}>{option.name}{`, `}</div>
            })
        }

        return currentValues[0].name;
    }

    const menuOpenClassName = isMenuOpen ? '_8erikw_dropdown_menu_open' : ''

    return (
        <div 
            className={`_8erikw_dropdown_container ${menuOpenClassName} ${containerClassName} `} 
        >
            <div ref={ref} role='button' className='_8erikw_dropdown_button' onClick={handleCloseMenu}>
                <div key={'dropdown_label'} className={`_8erikw_dropdown_label_name ${labelNameClassName}`}>{labelName}</div>
                <div key={'dropdown_value'} className='_8erikw_dropdown_value'>{renderDropdownValues()}</div>
                <div key={'dropdown_expand_icon'} className={`_8erikw_dropdown_expand_icon_container ${isMenuOpen ? '_8erikw_open' : '_8erikw_closed'}`}>
                    <ExpandIcon className={customExpandIconClassNames || '_8erikw_dropdown_expand_icon'}/>
                </div>

                {isMenuOpen && (
                    <div key={'dropdown_menu'} id='dropdown_menu' role='menu' className='_8erikw_dropdown_menu'>
                        {renderDropdownOptions}
                    </div>
                )}
            </div>
        </div>
    );
}

Dropdown.propTypes = {
    labelName: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]).isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
        })
    ).isRequired,
    defaultValues: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]).isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
        })
    ).isRequired,
    isMultiSelect: PropTypes.bool,
    containerClassName: PropTypes.string,
    labelNameClassName: PropTypes.string,
    isMenuDefaultOpen: PropTypes.bool,
    ExpandIcon: PropTypes.node,
    customExpandIconClassNames: PropTypes.string,
    customHandleDropdownMenuSelect: PropTypes.func,
    customOnBlur: PropTypes.func,
}

Dropdown.MenuItem = ({isMultiSelect = false, option, onSelect, isSelected}) => {
    return <div 
        key={option.value}
        className={`_8erikw_dropdown_menu_item ${isSelected ? '_8erikw_dropdown_menu_item_selected': ''}`}
        onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
        }}
    >
        {isMultiSelect && <Checkbox isSelected={isSelected}/>}
        {option.name}
    </div>
}

Dropdown.MenuItem.propTypes = {
    option: PropTypes.shape({
        name: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]).isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    }).isRequired,
    onSelect: PropTypes.func,
    isMultiSelect: PropTypes.bool,
    isSelected: PropTypes.bool,
}