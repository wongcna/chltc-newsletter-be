import { Router } from 'express';
//import { createUser, deleteUser, getUserById, updateUser } from '../services/user.mjs';
//import { isAuthenticated } from '../utils/authMiddleware.mjs';
import {signup, updateUser } from '../services/user.mjs';

const router = Router();

//router.use(isAuthenticated);

router.post("/signup", signup);
router.post("/updateUser", updateUser);


// router.post('/new', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await createUser(req.body);
//     res.status(201).send({ msg: 'User created', data: user });
//   } catch (error) {
//     res.status(400).send({ msg: 'Bad request', error: error.message });
//   }
// });

// router.patch('/:id', async (req, res) => {
//   const id = req.params.id;
//   const { email, password, role } = req.body;
//   try {
//     const updatedUser = await updateUser(req.params.id, req.body);
//     if (!updatedUser) {
//       return res.status(404).send({ msg: 'User not found' });
//     }
//     res.json({ msg: 'User updated', data: updatedUser });
//   } catch (error) {
//     res.status(400).send({ msg: 'Bad request', error });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedUser = await deleteUser(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).send({ msg: 'User not found' });
//     }
//     res.json({ msg: 'User deleted' });
//   } catch (error) {
//     res.status(400).send({ msg: 'Bad request', error });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const user = await getUserById(req.params.id);
//     if (!user) {
//       return res.status(404).send({ msg: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).send({ msg: 'Server error', error });
//   }
// });

export default router;
