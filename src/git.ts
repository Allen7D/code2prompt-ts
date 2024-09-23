import { simpleGit, SimpleGit } from 'simple-git';

/**
 * 获取git diff
 * @param repoPath 仓库路径
 * @returns git diff字符串
 */
export async function getGitDiff(repoPath: string): Promise<string> {
  const git: SimpleGit = simpleGit(repoPath);
  return git.diff();
}
