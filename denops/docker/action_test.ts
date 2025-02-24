import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { HttpClient } from "./http.ts";
import * as action from "./action.ts";

const httpClient = new HttpClient(
  await Deno.connect({
    port: 9999,
    hostname: "localhost",
    transport: "tcp",
  }),
);

Deno.test("get images", async () => {
  const got = await action.getImages(httpClient);
  const want = [
    "ID           REPOSITORY TAG     CREATED             SIZE     ",
    "e216a057b1cb ubuntu     12.04   2016/09/27 06:25:51 98.78 MB ",
    "e216a057b1cb ubuntu     precise 2016/09/27 06:25:51 98.78 MB ",
    "3e314f95dcac ubuntu     12.10   2014/06/19 06:54:15 164.09 MB",
    "3e314f95dcac ubuntu     quantal 2014/06/19 06:54:15 164.09 MB",
  ];

  assertEquals(got, want);
});

Deno.test("get containers", async () => {
  const got = await action.getContainers(httpClient);
  const want = [
    "ID           NAME           IMAGE         STATUS CREATED             PORTS                   ",
    "8dfafdbc3a40 boring_feynman ubuntu:latest Exit 0 2013/05/07 00:29:15 undefined:3333->2222/tcp",
    "9cd87474be90 coolName       ubuntu:latest Exit 0 2013/05/07 00:29:15                         ",
    "3176a2479c92 sleepy_dog     ubuntu:latest Exit 0 2013/05/07 00:29:14                         ",
    "4cb07b47f9fb running_cat    ubuntu:latest Exit 0 2013/05/07 00:29:12                         ",
  ];

  assertEquals(got, want);
});

Deno.test("remove image", async () => {
  const got = await action.removeImage(httpClient, "test");
  const want = true;
  assertEquals(got, want);
});

Deno.test("remove container", async () => {
  const got = await action.removeContainer(httpClient, "test");
  const want = true;
  assertEquals(got, want);
});

Deno.test("search image", async () => {
  const got = await action.searchImage(httpClient, "test");
  const want = [
    "NAME            DESCRIPTION STARTS OFFICIAL AUTOMATED",
    "wma55/u1210sshd                                      ",
    "jdswinbank/sshd                                      ",
    "vgauthier/sshd                                       ",
  ];
  assertEquals(got, want);
});

Deno.test("start container", async () => {
  const got = await action.startContainer(httpClient, "test");
  const want = true;
  assertEquals(got, want);
});

Deno.test("stop container", async () => {
  const got = await action.stopContainer(httpClient, "test");
  const want = true;
  assertEquals(got, want);
});

Deno.test("kill container", async () => {
  const got = await action.killContainer(httpClient, "test");
  const want = true;
  assertEquals(got, want);
});
