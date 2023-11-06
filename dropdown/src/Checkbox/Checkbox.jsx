import PropTypes from 'prop-types'
import React, { useState, memo } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline'
import './style.css'

export function Checkbox({isSelected, containerClassName}) {
  return <div className={`_8erikw_checkbox_container ${isSelected ? '_8erikw_checkbox_selected' : ''} ${containerClassName}`}>
        {isSelected && <CheckIcon className='_8erikw_checkbox'/>}
    </div>
}

Checkbox.propTypes = {
  isSelected: PropTypes.bool,
  containerClassName: PropTypes.string,
}