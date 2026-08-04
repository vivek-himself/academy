import { safeJsonParse } from "@/lib/json";

export function getCompletedModules(completedModulesJson: string): number[] {
  return safeJsonParse<number[]>(completedModulesJson, []);
}

export function getProgress(completedModulesJson: string, modulesCount: number) {
  const completed = getCompletedModules(completedModulesJson);
  const total = Math.max(modulesCount, 1);
  const percent = Math.min(100, Math.round((completed.length / total) * 100));
  return { completedCount: completed.length, total, percent };
}
