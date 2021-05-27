## Installation

`$ npm install --save immutability-helper shortid react-native-image-picker` 

or 

`$ yarn add immutability-helper shortid react-native-image-picker`


### example


<img style="width: 200px; height: auto; border-width: 1px; border-color: #eeeeee" src="https://github.com/decisionnguyen/rn-rich-text/blob/master/sample/image-sample.png" />

```
import React, {memo, useCallback, useEffect, useState} from "react";
import styled from "styled-components/native";
import {Keyboard, StatusBar, TouchableOpacity} from "react-native";
import {useNavigationParams} from "@/hooks/useNavigationParams";
import {goBack} from "@/utils/navigation";
import {HeaderBack} from "@/components/HeaderBack";
import { RichTextEditor } from 'rn-rich-text';

const SaveText = styled.Text`
  font-size: 13px;
  color: #111;
  font-weight: bold;
`;

export interface EditorModalProps {
    title: string,
    value: string,
    onUpdate: (value: string) => void
}

export const EditorModal = memo(function EditorModal() {
    const {title, value, onUpdate} = useNavigationParams<EditorModalProps>();
    const [note, setNote] = useState<string>(value);

    const onChangeText = useCallback((text) => {
        setNote(text)
    }, []);

    const onInsertImage = useCallback(async (uri: string, callback: (value: string) => void) => {
        callback(uri)
    }, []);

    const onSavePress = useCallback(() => {
        onUpdate && onUpdate(note);
        goBack()
    }, [onUpdate, note]);

    useEffect(() => {
        let stack: any = null;

        const onKeyboardShowHide = () => {
            console.log('vao day')

            setTimeout(() => {
                stack = StatusBar.pushStackEntry({
                    translucent: true,
                    showHideTransition: 'fade',
                    networkActivityIndicatorVisible: true,
                    animated: true,
                    backgroundColor: '#fff',
                    hidden: false,
                    barStyle: 'dark-content',
                });
                console.log('vao day')
            }, 500);
        };

        Keyboard.addListener('keyboardDidShow', onKeyboardShowHide);
        Keyboard.addListener('keyboardDidHide', onKeyboardShowHide);

        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardShowHide);
            Keyboard.removeListener('keyboardDidHide', onKeyboardShowHide);
            stack && StatusBar.popStackEntry(stack)
        }
    }, []);

    return (
        <SViewSafe>
            <HeaderBack
                title={title}
                right={
                    <TouchableOpacity onPress={onSavePress}>
                        <SaveText>Lưu</SaveText>
                    </TouchableOpacity>
                }
            />

            <SRichTextEditor
                toolbarItem={['bold', 'italic', 'underline', 'image', 'h1', 'h2', 'ul', 'ol']}
                value={note}
                placeHolder={'Nhập vào dữ liệu'}
                onValueChanged={onChangeText}
                textColor={"#000000"}
                autoFocus={true}
                onInsertImage={onInsertImage}
                backgroundIconColor={"#FFFFFF"}
                selectedBackgroundColor={"#ddd"}/>

        </SViewSafe>
    );
});


const SViewSafe = styled.View`
    flex: 1;
    background-color: #fff;
`;

const SRichTextEditor = styled(RichTextEditor).attrs(() => ({
    containerStyle: {
        backgroundColor: "#ffffff",
    },
    toolbarStyle: {
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#ffffff",
        paddingLeft: 16,
    },
}))``;

```

