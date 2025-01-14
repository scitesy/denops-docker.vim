import { Denops } from "https://deno.land/x/denops_std@v1.0.0-beta.8/mod.ts";
import { HttpClient, Response } from "./http.ts";
import { runTerminal } from "./vim_util.ts";
import {
  Container,
  Image,
  removeContainerOpts,
  removeImageOpts,
  SearchImage,
} from "./types.ts";

export async function images(cli: HttpClient): Promise<Image[]> {
  const resp = await cli.get<Image[]>("/images/json");
  return resp.body;
}

export async function inspectImage(
  denops: Denops,
  id: string,
): Promise<string[]> {
  const cmd = `docker inspect ${id}`;
  const result = await denops.call("systemlist", cmd) as string[];
  return result;
}

export async function removeImage(
  cli: HttpClient,
  name: string,
  opts: removeImageOpts = { force: false, noprune: false },
): Promise<Response> {
  const resp = await cli.delete(`/images/${name}`, {
    params: {
      force: opts.force,
      noprune: opts.noprune,
    },
  });
  return resp;
}

export async function removeContainer(
  cli: HttpClient,
  name: string,
  opts: removeContainerOpts = { v: false, force: false, link: false },
): Promise<Response> {
  const resp = await cli.delete(`/containers/${name}`, {
    params: {
      v: opts.v,
      force: opts.force,
      link: opts.link,
    },
  });
  return resp;
}

export async function containers(cli: HttpClient): Promise<Container[]> {
  const resp = await cli.get<Container[]>("/containers/json?all=true");
  return resp.body;
}

export async function pullImage(denops: Denops, name: string) {
  const [image, tag] = name.split(":");
  const fromImage = [image, ":", (tag || "latest")].join("");
  await runTerminal(denops, ["docker", "pull", fromImage]);
}

export async function searchImage(
  cli: HttpClient,
  name: string,
): Promise<SearchImage[]> {
  const resp = await cli.get<SearchImage[]>("/images/search", {
    params: {
      term: name,
      limit: 100,
    },
  });
  return resp.body;
}

export async function quickrunImage(denops: Denops, name: string) {
  const cmd = <string[]> [
    "docker",
    "run",
    "--rm",
    "-it",
    "--detach-keys=ctrl-\\",
    "--entrypoint",
    "sh",
    name,
    "-c",
    "[ -e /bin/bash ] || [ -e /usr/local/bin/bash ] && bash || sh",
  ];
  await runTerminal(denops, cmd);
}

export async function attachContainer(denops: Denops, name: string) {
  const cmd = <string[]> [
    "docker",
    "exec",
    "-it",
    "--detach-keys=ctrl-\\",
    name,
    "sh",
    "-c",
    "[ -e /bin/bash ] || [ -e /usr/local/bin/bash ] && bash || sh",
  ];
  await runTerminal(denops, cmd);
}

export async function execContainer(
  denops: Denops,
  name: string,
  command: string,
  args: string[],
) {
  const cmd = <string[]> [
    "docker",
    "exec",
    "-it",
    "--detach-keys=ctrl-\\",
    name,
    command,
  ];
  cmd.push(...args);
  await runTerminal(denops, cmd);
}

export async function tailContainerLogs(denops: Denops, name: string) {
  const cmd = <string[]> [
    "docker",
    "logs",
    "-f",
    name,
  ];
  await runTerminal(denops, cmd);
}

export async function startContainer(
  cli: HttpClient,
  name: string,
): Promise<Response> {
  return await cli.post(`/containers/${name}/start`);
}

export async function stopContainer(
  cli: HttpClient,
  name: string,
): Promise<Response> {
  return await cli.post(`/containers/${name}/stop`);
}

export async function killContainer(
  cli: HttpClient,
  name: string,
): Promise<Response> {
  return await cli.post(`/containers/${name}/kill`);
}

export async function inspectContainer(
  denops: Denops,
  name: string,
): Promise<string[]> {
  const cmd = `docker inspect ${name}`;
  const result = await denops.call("systemlist", cmd) as string[];
  return result;
}

export async function restartContainer(
  cli: HttpClient,
  name: string,
): Promise<Response> {
  return await cli.post(`/containers/${name}/restart`);
}
