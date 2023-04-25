import * as React from "react";
import { getProjects, updateProject, Project, addProject } from "./models/projects";

interface ProjectDisplayProps {
  project: Project
  onProjectChange?(project: Project): void
}
function ProjectDisplay({ project, onProjectChange }: ProjectDisplayProps) {
  const [projectInfo, setProjectInfo] = React.useState(project)
  const [isEditMode, setEditMode] = React.useState(false)

  if (!isEditMode) {
    return (
      <div className="flex flex-row gap-4">
        <p>{project.name}</p>
        <button onClick={() => setEditMode(true)}>Edit</button>
      </div>
    )
  } else {
    return (
      <div className="flex flex-row gap-4">
        <input value={projectInfo.name} onChange={(e) => {
          setProjectInfo(prev => ({
            ...prev,
            name: e.target.value
          }))
        }} />
        <button onClick={() => {
          setEditMode(false)
          onProjectChange?.(projectInfo)
        }}>Save</button>
        <button onClick={() => {
          setEditMode(false)
          setProjectInfo(project)
        }}>Cancel</button>
      </div>
    )
  }
}

function App() {
  const [newName, setNewName] = React.useState('')
  const [projects, setProjects] = React.useState<Project[]>([])

  React.useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <div className="p-4">
      <ul className="list-disc list-inside">
        {projects.map(project => (
          <li key={project.id}><ProjectDisplay project={project} onProjectChange={(updatedProject) => {
            updateProject(updatedProject).then(setProjects)
          }} /></li>
        ))}
      </ul>
      <input placeholder="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <button onClick={() => {
        addProject({name: newName}).then((newProjects) => {
          setNewName('')
          setProjects(newProjects)
        })
      }}>Submit</button>
    </div>
  );
}

export default App;
