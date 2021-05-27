import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';

export const CNToolbarIcon = (props) => {
    const {
        size,
        backgroundColor,
        color,
        iconStyles,
        toolTypeText,
        iconComponent,
        onStyleKeyPress,
        selectedColor,
        selectedStyles,
        selectedTag,
        buttonTypes,
        selectedBackgroundColor,
    } = props;
    let colorCondition = '';
    let backgroundColorCondition = '';
    if (buttonTypes === 'style') {
        backgroundColorCondition = selectedStyles.indexOf(toolTypeText) >= 0 ? selectedBackgroundColor : backgroundColor;
        colorCondition = selectedStyles.indexOf(toolTypeText) >= 0 ? selectedColor : color;
    } else if (buttonTypes === 'tag') {
        backgroundColorCondition = selectedTag === toolTypeText ? selectedBackgroundColor : backgroundColor;
        colorCondition = selectedTag === toolTypeText ? selectedColor : color;
    }
    const defaultStyle = typeof iconComponent === Text ? {
        color: colorCondition,
        fontSize: size,
    } : {

    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                onStyleKeyPress(toolTypeText);
            }}
        >
            <View style={[iconStyles,
                {
                    backgroundColor: backgroundColorCondition,
                }]}
            >
                {
                    React.cloneElement(iconComponent,
                        {
                            size, color: colorCondition,
                            style: [
                                defaultStyle,
                                iconComponent.props.style || {}],
                        })
                }
            </View>
        </TouchableWithoutFeedback>
    );
};
