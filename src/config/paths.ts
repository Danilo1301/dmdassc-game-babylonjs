import { join } from "path";

export const PATH_ROOT = join(process.cwd());
export const PATH_SRC = join(PATH_ROOT, 'src');
export const PATH_PUBLIC = join(PATH_ROOT, 'public');
export const PATH_BUILD = join(PATH_PUBLIC, 'game');
//export const CLIENT = join(SRC, 'client');
