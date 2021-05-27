import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    StatusBar,
    TouchableWithoutFeedback,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    ViewStyle,
    ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import CNRichTextEditor from './CNEditor';
import CNToolbar from './CNToolbar';
import {convertToObject, convertToHtmlString, getInitialObject, getDefaultStyles} from './Convertors';

import {
    IC_COLOR_FILL,
    IC_COLOR_TEXT,
    IC_FORMAT_BOLD,
    IC_FORMAT_ITALIC,
    IC_FORMAT_PHOTO,
    IC_FORMAT_STRIKE,
    IC_FORMAT_UNDERLINE, IC_HEADING_1, IC_HEADING_2, IC_LIST_BULLET, IC_LIST_NUMBER,
} from './icons/icons';


const IS_IOS = Platform.OS === 'ios';
const {width, height} = Dimensions.get('window');
const defaultStyles = getDefaultStyles();
const toolbarActionWidth = 28;

interface Props {
    value: string,
    onValueChanged?: (value: string) => void,
    placeHolder?: string,
    toolbarItem?: string[], // ['bold', 'italic', 'underline', 'lineThrough', 'h1', 'h2', 'ul', 'ol', 'image', 'color', 'P']
    onInsertImage?: (uri: string, callback: (value: string) => void) => void,
    autoFocus?: boolean,
    containerStyle?: ViewStyle,
    textColor?: string,
    toolbarStyle?: ViewStyle,
    selectedBackgroundColor?: string,
    backgroundIconColor?: string
}

interface State {
    selectedTag: string,
    selectedColor: string,
    selectedHighlight: string,
    colors: string[],
    highlights: string[],
    selectedStyles: any[],
    value: string,
    placeholder: string,
    iconSet: any[],
    uploading: boolean
}

const styleBtnAction = {
    width: 20,
    height: 20,
    marginVertical: 2,
    marginHorizontal: 6,
};
const styleActionText = {
    fontSize: 20,
    minWidth: toolbarActionWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 4,
    fontWeight: 'bold',
    color: '#737373',
};

const initIconSet = {
    'bold': {
        type: 'tool',
        iconArray: [{
            toolTypeText: 'bold',
            buttonTypes: 'style',
            iconComponent: <Image source={IC_FORMAT_BOLD} style={styleBtnAction}/>,
        },
        ],
    },
    'italic': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'italic',
                buttonTypes: 'style',
                iconComponent: <Image source={IC_FORMAT_ITALIC} style={styleBtnAction}/>,
            },
        ],
    },
    'underline': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'underline',
                buttonTypes: 'style',
                iconComponent: <Image source={IC_FORMAT_UNDERLINE} style={styleBtnAction}/>,
            },
        ],
    },
    'lineThrough': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'lineThrough',
                buttonTypes: 'style',
                iconComponent: <Image source={IC_FORMAT_STRIKE} style={styleBtnAction}/>,
            },
        ],
    },
    'h1': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'title',
                buttonTypes: 'tag',
                iconComponent: <Image source={IC_HEADING_1} style={styleBtnAction}/>,
            },
        ],
    },
    'h2': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'heading',
                buttonTypes: 'tag',
                iconComponent: <Image source={IC_HEADING_2} style={styleBtnAction}/>,
            },
        ],
    },
    'p': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'body',
                buttonTypes: 'tag',
                iconComponent: <Text style={styleActionText}>P</Text>,
            },
        ],
    },
    'ul': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'ul',
                buttonTypes: 'tag',
                iconComponent: <Image source={IC_LIST_BULLET} style={styleBtnAction}/>,
            },
        ],
    },
    'ol': {
        type: 'tool',
        iconArray: [
            {
                toolTypeText: 'ol',
                buttonTypes: 'tag',
                iconComponent: <Image source={IC_LIST_NUMBER} style={styleBtnAction}/>,
            },
        ],
    }
};

class WrapRichText extends Component<Props, State> {
    private readonly customStyles: any;
    private editor: null;

    constructor(props) {
        super(props);
        this.customStyles = {
            ...defaultStyles,
            body: {fontSize: 14},
            heading: {fontSize: 16},
            title: {fontSize: 20},
            ol: {fontSize: 14},
            ul: {fontSize: 14},
            bold: {fontSize: 14, fontWeight: 'bold', color: ''},
        };
        this.state = {
            selectedTag: 'body',
            selectedColor: 'default',
            selectedHighlight: 'default',
            colors: ['red', 'green', 'blue', 'black'],
            highlights: ['yellow_hl', 'pink_hl', 'orange_hl', 'green_hl', 'purple_hl', 'blue_hl'],
            selectedStyles: [],
            value: "",
            placeholder: "",
            iconSet: [],
            uploading: false
        };

        this.editor = null;

    }

    UNSAFE_componentWillMount = () => {
        let {value, placeHolder, toolbarItem} = this.props;

        if (!toolbarItem) {
            toolbarItem = []
        }

        let listIconSet = [];
        for (let i = 0; i < toolbarItem.length; i++) {
            const _iconName = toolbarItem[i];
            const _iconSet = initIconSet[_iconName];
            if (_iconSet) {
                listIconSet = listIconSet.concat(_iconSet)
            }
        }

        this.setState({
            value,
            placeHolder,
            iconSet: listIconSet
        });
        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    };

    UNSAFE_componentWillUnmount = () => {
        Keyboard.removeAllListeners('keyboardDidShow', this._keyboardDidShow)
    };

    _keyboardDidShow = () => {
        this.editor && this.editor.keyboardShow();
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('dark-content');
        } else {
            StatusBar.setBarStyle('light-content');
        }
    };

    onStyleKeyPress = (toolType) => {
        if (toolType == 'image') {
            return;
        } else {
            this.editor && this.editor.applyToolbar(toolType);
        }

    };

    onSelectedTagChanged = (tag: string) => {
        this.setState({
            selectedTag: tag,
        });
    };

    onSelectedStyleChanged = (styles: any) => {
        const colors = this.state.colors;
        const highlights = this.state.highlights;
        let sel = styles.filter(x => colors.indexOf(x) >= 0);

        let hl = styles.filter(x => highlights.indexOf(x) >= 0);
        this.setState({
            selectedStyles: styles,
            selectedColor: (sel.length > 0) ? sel[sel.length - 1] : 'default',
            selectedHighlight: (hl.length > 0) ? hl[hl.length - 1] : 'default',
        });

    };

    onValueChanged = (value: string) => {
        this.setState({
            value: value,
        });
        this.props.onValueChanged && this.props.onValueChanged(value)
    };

    insertImage(url: string) {
        this.editor && this.editor.insertImage(url);
    }

    useLibraryHandler = async () => {
        let options = {};
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                if (!this.props.onInsertImage) {
                    return
                }

                this.setState({
                    uploading: true
                });
                this.props.onInsertImage(response.uri, (value: string) => {
                    this.setState({
                        uploading: false
                    });
                    this.insertImage(typeof value === 'string' ? value : "");
                });
            }
        });
    };

    onColorSelectorClicked = (value) => {

        if (value === 'default') {
            this.editor.applyToolbar(this.state.selectedColor);
        } else {
            this.editor.applyToolbar(value);

        }

        this.setState({
            selectedColor: value,
        });
    };

    onHighlightSelectorClicked = (value: string) => {
        if (value === 'default') {
            this.editor && this.editor.applyToolbar(this.state.selectedHighlight);
        } else {
            this.editor && this.editor.applyToolbar(value);

        }
        this.setState({
            selectedHighlight: value,
        });
    };

    onRemoveImage = (value: any) => {
        const {url, id} = value;
        // do what you have to do after removing an image
        console.log(`image removed (url : ${url})`);
    };

    getOtherTool = (icons: string[] = []) => {
        let _result: {type: string, iconArray: any[]} = {
            type: 'tool',
            iconArray: [],
        };
        let hasData = false;
        if (icons.indexOf('image') > -1) {
            _result.iconArray = [{
                toolTypeText: 'image',
                iconComponent: this.renderImageSelector(),
            }];
            hasData = true
        }
        if (!hasData) {
            return null
        }
        return _result
    };

    renderImageSelector() {
        if (this.state.uploading) {
            return (
                <ActivityIndicator color={'#0077cc'}/>
            )
        }
        return (
            <TouchableOpacity onPress={this.useLibraryHandler}>
                <Image
                    source={IC_FORMAT_PHOTO}
                    style={styleBtnAction}/>
            </TouchableOpacity>
        )
    }

    render() {
        const _result = this.getOtherTool(this.props.toolbarItem || []);

        let newIconSet = [
            ...this.state.iconSet,
            _result ? _result : null
        ];
        return (
            <KeyboardAvoidingView
                enabled
                style={styles.root}
                behavior={IS_IOS ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <View style={styles.main}>
                        <CNRichTextEditor
                            ref={input => this.editor = input}
                            onSelectedTagChanged={this.onSelectedTagChanged}
                            onSelectedStyleChanged={this.onSelectedStyleChanged}
                            initialHtml={this.state.value}
                            style={styles.editor}
                            styleList={this.customStyles}
                            onValueChanged={this.onValueChanged}
                            onRemoveImage={this.onRemoveImage}
                            placeholder={this.state.placeHolder}
                            autoFocus={this.props.autoFocus}
                            textColor={this.props.textColor || ""}
                            containerStyle={this.props.containerStyle}
                        />
                    </View>
                    {
                        this.state.iconSet.length
                            ? <View style={styles.toolbarContainer}>
                                <CNToolbar
                                    style={[styles.toolbarStyle, this.props.toolbarStyle]}
                                    iconSetContainerStyle={styles.iconSetContainerStyle}
                                    size={28}
                                    iconSet={newIconSet}
                                    selectedTag={this.state.selectedTag}
                                    selectedStyles={this.state.selectedStyles}
                                    onStyleKeyPress={this.onStyleKeyPress}
                                    backgroundColor={this.props.backgroundIconColor || "aliceblue"} // optional (will override default backgroundColor)
                                    color="#333333" // optional (will override default color)
                                    selectedColor='white' // optional (will override default selectedColor)
                                    selectedBackgroundColor={this.props.selectedBackgroundColor || 'deepskyblue'} // optional (will override default selectedBackgroundColor)
                                />
                            </View>
                            : null
                    }
                </View>
            </KeyboardAvoidingView>
        );
    }

}

var styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    toolbarStyle: {
        height: 40,
    },
    iconSetContainerStyle: {
        flexGrow: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    main: {
        flex: 1,
        alignItems: 'stretch',
    },
    editor: {},
    toolbarContainer: {
        minHeight: 40,
    },
    menuOptionText: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    divider: {
        marginVertical: 0,
        marginHorizontal: 0,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});


export default WrapRichText;
