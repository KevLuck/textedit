import { getDb, putDb } from './database';
import { header } from './header';

export default class SocialNetworkEditor {
  constructor(userId, thoughtId, title) {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.userId = userId;
    this.thoughtId = thoughtId;
    this.title = title;

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb(userId, thoughtId).then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || header);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(userId, thoughtId, this.editor.getValue());
    });
  }

  // Saves the content of the editor to IndexedDB
  async save() {
    const content = this.editor.getValue();
    await putDb(this.userId, this.thoughtId, content);
  }

  // Loads the content of the editor from IndexedDB
  async load() {
    const content = await getDb(this.userId, this.thoughtId);
    this.editor.setValue(content);
  }

  // Gets the user's feed of thoughts
  async getFeed() {
    // TODO: Implement this method
  }

  // Searches for thoughts
  async search(searchTerm) {
    // TODO: Implement this method
  }
}
