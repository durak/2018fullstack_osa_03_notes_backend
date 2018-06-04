const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Note = require('../models/note')
const { format, initialNotes, nonExistingId, notesInDb } = require('./test_helper')


describe('when there is initially some notes saved', async () => {
  beforeAll(async () => {
    await Note.remove({})   // tyhjennetään kanta

    const noteObjects = initialNotes.map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)

    /*   for (let note of initialNotes) {
        let noteObject = new Note(note)
        await noteObject.save()
      } */
  })

  /**
   * hae kaikki DB:stä
   * hae vastaus palvelimelta
   * expect saman kokoiset
   * expect jokaisen DB:stä haetun contentin löytyvät palvelimen vastauksesta
   */
  test('all notes are returned as json by GET /api/notes', async () => {
    const notesInDatabase = await notesInDb()

    const response = await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(notesInDatabase.length)

    const returnedContents = response.body.map(n => n.content)
    notesInDatabase.forEach(note => {
      expect(returnedContents).toContain(note.content)
    })
  })

  /**
   * hae kaikki DB:stä
   * hae DB[0] id:llä palvelimelta
   * expect palvelimen content sama
   */
  test('individual notes are returned as json by GET /api/notes/:id', async () => {
    const notesInDatabase = await notesInDb()
    const aNote = notesInDatabase[0]

    const response = await api
      .get(`/api/notes/${aNote.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.content).toBe(aNote.content)
  })

  /**
   * muodosta valid id ja poista se palvelimelta
   * hae palvelimelta id:llä
   * expect 404
   */
  test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    const response = await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  /**
   * hae palvelimelta virheellisellä id:llä
   * expect 400
   */
  test('400 is returned by GET /api/notes/:id with invalid id', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    const response = await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })

  describe('addition of a new note', async () => {

    /**
     * hae kaikki DB:stä
     * lähetä validi uusi note palvelimelle
     * hae laollo uudestaan DB:stä
     * expect length +1
     * expect uuden noten löytyneen palvelimen contentista
     */
    test('POST /api/notes succeeds with valid data', async () => {
      const notesAtStart = await notesInDb()

      const newNote = {
        content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const notesAfterOperation = await notesInDb()

      expect(notesAfterOperation.length).toBe(notesAtStart.length + 1)

      const contents = notesAfterOperation.map(r => r.content)
      expect(contents).toContain('async/await yksinkertaistaa asynkronisten funktioiden kutsua')
    })

    /**
     * hae kaikki DB:stä
     * lähetä palvelimelle virheelllinen note missing content
     * expect 400
     * hae kaikki DB:stä
     * expect length sama
     */
    test('POST /api/notes fails with proper statuscode if content is missing', async () => {
      const newNote = {
        important: true
      }

      const notesAtStart = await notesInDb()

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAfterOperation = await notesInDb()

      expect(notesAfterOperation.length).toBe(notesAtStart.length)
    })
  })

  describe('deletion of a note', async () => {
    let addedNote

    beforeAll(async () => {
      addedNote = new Note({
        content: 'poisto pyynnöllä HTTP DELETE',
        important: false
      })
      await addedNote.save()
    })

    /**
     * hake kaikk iDB:stä
     * poista note DB:stä
     * expect 204
     * hae kaikki db:stä
     * expect DB:n content ei sisällä poistettua notea
     * expect length - 1
     */
    test('DELETE /api/notes/:id succeeds with proper statuscode', async () => {
      const notesAtStart = await notesInDb()

      await api
        .delete(`/api/notes/${addedNote._id}`)
        .expect(204)

      const notesAfterOperation = await notesInDb()

      const contents = notesAfterOperation.map(r => r.content)

      expect(contents).not.toContain(addedNote.content)
      expect(notesAfterOperation.length).toBe(notesAtStart.length - 1)
    })
  })

  afterAll(() => {
    server.close()
  })

})