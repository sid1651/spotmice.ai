import Project from "../models/Project.js";

/**
 * Save project notes
 * - Creates project if it does not exist
 * - Updates notes if it exists
 */
export async function saveProject(projectId, notes) {
  if (!projectId) return;

  try {
    const project = await Project.findOne({ projectId });

    // 🆕 FIRST TIME → CREATE
    if (!project) {
      await Project.create({
        projectId,
        notes,
      });
      console.log("🆕 Project created:", projectId);
      return;
    }

    // 🔄 EXISTING → UPDATE
    project.notes = notes;
    await project.save();

    console.log("💾 Project updated:", projectId);
  } catch (err) {
    console.error("❌ saveProject failed:", err);
  }
}
