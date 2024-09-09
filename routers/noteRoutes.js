import express from 'express';
import notesController from '../controllers/notesController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.use(verifyJWT);

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote);

export default router;
