import React  from 'react'
import {
    View,
} from 'react-native'
import { CNToolbarIcon } from './CNToolbarIcon'

export const CNToolbarSetIcon = (props) => {
    const {
        size,
        color,
        backgroundColor,
        selectedColor,
        selectedBackgroundColor,
        selectedStyles,
        selectedTag,
        iconArray,
        iconSetContainerStyle,
        iconStyles,
        onStyleKeyPress
    } = props;

    return (
        <View style={iconSetContainerStyle}>
            {iconArray.map((object, index) => {
                if (!object) {
                    return <View />
                }
                const {
                    toolTypeText,
                    iconComponent,
                    buttonTypes
                } = object;
                return (
                    <CNToolbarIcon
                        key={index}
                        size={size}
                        backgroundColor={backgroundColor}
                        color={color}
                        iconStyles={iconStyles}
                        toolTypeText={toolTypeText}
                        iconComponent={iconComponent}
                        onStyleKeyPress={onStyleKeyPress}
                        selectedColor={selectedColor}
                        selectedStyles={selectedStyles}
                        selectedTag={selectedTag}
                        buttonTypes={buttonTypes}
                        selectedBackgroundColor={selectedBackgroundColor}
                    />
                )
            })}
        </View>
    )
}
