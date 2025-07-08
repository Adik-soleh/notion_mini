<template>
  <div class="text-editor">
    <div class="editor-container">
      <div class="toolbar">
        <button 
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ active: editor.isActive('bold') }"
          class="toolbar-btn"
        >
          <i class="material-icons">format_bold</i>
        </button>
        <button 
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ active: editor.isActive('italic') }"
          class="toolbar-btn"
        >
          <i class="material-icons">format_italic</i>
        </button>
        <button 
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ active: editor.isActive('underline') }"
          class="toolbar-btn"
        >
          <i class="material-icons">format_underlined</i>
        </button>
      </div>
      
      <!-- Editor Content -->
      <div class="editor-content">
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { watch } from 'vue'

export default {
  name: 'TextEditor',
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  emits: ['update:content'],
  setup(props, { emit }) {
    const editor = useEditor({
      extensions: [StarterKit, Underline],
      content: props.content || '',
      onUpdate: ({ editor }) => {
        emit('update:content', editor.getHTML())
      },
    })

    watch(() => props.content, (newContent) => {
      if (editor.value && String(newContent) !== editor.value.getHTML()) {
        editor.value.commands.setContent(String(newContent))
      }
    })

    return {
      editor
    }
  }
}
</script>

<style scoped>
.text-editor {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.toolbar-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.toolbar-btn.active {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #2196f3;
}

.toolbar-btn i {
  font-size: 18px;
}

.editor-content {
  min-height: 100px;
}

/* TipTap Editor Styles */
.editor-content :deep(.ProseMirror) {
  outline: none;
  padding: 8px;
  min-height: 100px;
}

.editor-content :deep(.ProseMirror p) {
  margin: 8px 0;
}

.editor-content :deep(.ProseMirror p:first-child) {
  margin-top: 0;
}

.editor-content :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.editor-content :deep(.ProseMirror strong) {
  font-weight: bold;
}

.editor-content :deep(.ProseMirror em) {
  font-style: italic;
}

.editor-content :deep(.ProseMirror u) {
  text-decoration: underline;
}
</style>