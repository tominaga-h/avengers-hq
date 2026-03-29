import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/multi-agent-avengers';

const WORKER_AGENTS = ['tony', 'cap', 'marvel', 'peter', 'starlord', 'bruce'];

interface FuryCommand {
  id: string;
  purpose?: string;
  status?: string;
  priority?: string;
  timestamp?: string;
  north_star?: string;
  command?: string;
  acceptance_criteria?: string[];
  project?: string;
}

interface FuryToJarvisYaml {
  commands?: FuryCommand[];
}

interface WorkerTask {
  task_id: string | null;
  parent_cmd: string | null;
  description: string | null;
  status: string | null;
  working_dir: string | null;
}

interface WorkerTaskYaml {
  task?: WorkerTask;
}

function readFuryCommands(): FuryCommand[] {
  const filePath = path.join(AVENGERS_ROOT, 'queue', 'fury_to_jarvis.yaml');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(raw) as FuryToJarvisYaml;
  return parsed?.commands ?? [];
}

function readWorkerTasks(): { agent: string; task: WorkerTask }[] {
  return WORKER_AGENTS.flatMap(agent => {
    const filePath = path.join(AVENGERS_ROOT, 'queue', 'tasks', `${agent}.yaml`);
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = yaml.load(raw) as WorkerTaskYaml;
    const task = parsed?.task;
    if (!task || !task.task_id) return [];
    return [{ agent, task }];
  });
}

export function listTasks(_req: Request, res: Response): void {
  const commands = readFuryCommands();
  const workerTasks = readWorkerTasks();

  const result = commands.map(cmd => ({
    id: cmd.id,
    purpose: cmd.purpose ?? null,
    status: cmd.status ?? null,
    priority: cmd.priority ?? null,
    timestamp: cmd.timestamp ?? null,
    north_star: cmd.north_star ?? null,
    command: cmd.command ?? null,
    acceptance_criteria: cmd.acceptance_criteria ?? [],
    project: cmd.project ?? null,
    subtasks: workerTasks
      .filter(({ task }) => task.parent_cmd === cmd.id)
      .map(({ agent, task }) => ({
        task_id: task.task_id,
        agent,
        description: task.description ?? null,
        status: task.status ?? null,
        working_dir: task.working_dir ?? null,
      })),
  }));

  res.json({ commands: result });
}
