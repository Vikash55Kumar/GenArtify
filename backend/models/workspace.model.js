import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    destylProjectId: {
        type: String,
        default: null,
        index: true
    },
    destylIngestKey: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Workspace = mongoose.models.workspace || mongoose.model("workspace", workspaceSchema);

export default Workspace;
