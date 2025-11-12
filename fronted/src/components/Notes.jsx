import React from 'react';

export class Notes extends React.Component {

  constructor() {
    super();
    this.state = {
      notes: []
    }  

    this.baseUrl = 'http://localhost:7070/notes'    

    this.componentDidMount = this.componentDidMount.bind(this)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.NoteShow = this.NoteShow.bind(this);
    this.render = this.render.bind(this);
  }

  async LoadNotes() {
    const response = await fetch(this.baseUrl);
    console.log('Загрузка данных', response.status)
    const data = await response.json();

    this.setState({ notes: data })

    return data;
  }

  async SaveNote(index, text) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: {index}, content: {text} })
    });
    console.log('Сохранение данных', response.status)
    return response;
  }

  async deleteNote(index) {
    const response = await fetch(`${this.baseUrl}/${index}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Удаление данных', response.status);
    this.setState ({ notes: this.state.notes.filter((el, _) => el.id !== index) });
    return response;
  };

  async componentDidMount() {
    this.LoadNotes()
  }

  async handleSubmit(e) {
    e.preventDefault();

    const newNote = e.target.querySelector('.new-note')
    const noteText = newNote.value
    const noteId = this.state.notes.length + 1

    if (!noteText) {
      console.log('Возврат из-за пустого поля')
      return;
    }
    
    await this.SaveNote(noteId, noteText)

    const data = await this.LoadNotes();
    this.setState({ notes: data})
    
    e.target.reset();
  }
 

  FormAddNote () {
    return (
      <form className='form' onSubmit={this.handleSubmit}>
        <div className='input-box'>
          <label htmlFor='new-note'>Новая запись</label>
          <textarea type='text' id='new-note' className='input-zone new-note' placeholder="Введите текст новой записи" />
        </div>
        <button type='submit' className='btn-add'>🞂</button>
      </form>
    )
  };

  NoteShow({ note, onDelete }) {
    return (
      <div className='note'>
        <div className='note-box'>
          <div className='note-text'>{note}</div>
        </div>
        <button onClick={onDelete} className='btn-del'>✘</button>
      </div>
    )

  };


  render() {
    const notes = this.state.notes;
    console.log('Рендеринг:', notes)

    return (
      <div className='form-container'>
        <div className='note-header'>
          <div className='note-title'>Записи</div>
          <button className='btn-upd' onClick={() => this.LoadNotes()}>🗘</button>
        </div>
        <div className='notes-container'>
          {notes.length > 0 && notes.map((note, _) => (<this.NoteShow key={note.id} note={note.content.text} onDelete={() => this.deleteNote(note.id)} />))}
        </div>
        {this.FormAddNote()}
      </div>
    );
  }

}
