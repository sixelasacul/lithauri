import {v4 as uuid} from 'uuid'
import { z } from "zod";
import {BaseDirectory, exists, readTextFile, writeTextFile} from '@tauri-apps/api/fs'

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  contributors: z.array(z.string()),
  start: z.coerce.date(),
  end: z.coerce.date()
})
const projectsSchema = z.array(projectSchema)

export type Project = z.infer<typeof projectSchema>

let projects: Project[] = [
  {id: uuid(), name: 'Lithoprojets', description: 'Cimetière de projets abandonnés', contributors: ['Alexis'], start: new Date(2018, 11, 28, 0, 0,0 ), end: new Date(2018, 11, 28, 0, 0,0 )}
]

const FILE_NAME = 'projects.json'
const FS_OPTION = {dir: BaseDirectory.AppData}

async function writeProjects(projects: Project[]) {
  await writeTextFile(FILE_NAME, JSON.stringify(projects), FS_OPTION)
}

export async function getProjects() {
  if(await exists(FILE_NAME, FS_OPTION)) {
    const content = await readTextFile(FILE_NAME, FS_OPTION)
    try {
      return projects = projectsSchema.parse(JSON.parse(content))
    } catch(e) {
      console.error('Projects saved in an invalid format', content, e)
      return []
    }
  } else {
    return []
  }
}

const BASE_PROJECT: Omit<Project, 'id' | 'name'> = {
  description: 'test',
  contributors: ['Alexis'],
  start: new Date(),
  end: new Date()
}
export async function addProject(project: Pick<Project, 'name'>) {
  projects.push({
    ...BASE_PROJECT,
    ...project,
    id: uuid()
  })
  await writeProjects(projects)
  return projects
}

export async function updateProject(project: Project) {
  projects = projects.map(p => {
    if(p.id === project.id) {
      return project
    } else {
      return p
    }
  })
  await writeProjects(projects)
  return projects
}
