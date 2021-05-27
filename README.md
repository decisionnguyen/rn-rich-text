## Installation

`$ npm install --save immutability-helper shortid react-native-image-picker` 

or 

`$ yarn add immutability-helper shortid react-native-image-picker`


### example


<img style="width: 300px; height: auto; border-width: 1px; border-color: #eeeeee" src="https://git.base.vn/base-rn/rn-rich-text/raw/master/sample/image-sample.png" />

```
import { RichTextEditor } from 'rn-rich-text';

const SRichTextEditor = styled(RichTextEditor).attrs(props => ({
  containerStyle: {
    backgroundColor: props.theme.backgroundColor,
  },
  toolbarStyle: {
    backgroundColor: props.theme.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: props.theme.border.black10,
  },
}))``;
<View style={{flex: 1}}>
    <SRichTextEditor
      toolbarItem={['bold', 'italic', 'underline', 'h1', 'h2', 'ul', 'ol', 'image']}
      value={content}
      placeHolder={i18n.t('task.Edit_task_description')}
      onValueChanged={onTextChange}
      textColor={theme.text.gray1}
    />
</View>
```

