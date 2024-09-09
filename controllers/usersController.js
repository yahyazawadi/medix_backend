const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all Users
// @route GET /Users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all Users from MongoDB
    const Users = await User.find().select('-password').lean()

    // If no Users 
    if (!Users?.length) {
        return res.status(400).json({ message: 'No Users found' })
    }

    res.json(Users)
})

// @desc Create new user
// @route POST /Users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body

    // Confirm data
    if (!email || !password || !Array.isArray(role) || !role.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate email
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { email, "password": hashedPwd, role }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /Users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, email, role, active, password } = req.body

    // Confirm data 
    if (!id || !email || !Array.isArray(role) || !role.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    user.email = email
    user.role = role
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.email} updated` })
})

// @desc Delete a user
// @route DELETE /Users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `email ${result.email} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}