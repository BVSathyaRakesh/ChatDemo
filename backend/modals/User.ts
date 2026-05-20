import {Schema, model} from 'mongoose'
import type { UserProps } from '../types'

const UserSchema = new Schema<UserProps>({
    email: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type:String,
    },
    avatar: {
        type: String,
        default: null
    },
    created: {
        type: Date,
       default: Date.now
    }
})

const User = model<UserProps>('User', UserSchema);

export default User;