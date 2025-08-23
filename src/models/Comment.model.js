import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount:{
    type:Number,
    default:0
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    editedAt: Date,
    previousText: String
  }],
  parentComment:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }
}, {
  timestamps: true
});


const Comment = mongoose.model('Comment', commentSchema); 

export default Comment