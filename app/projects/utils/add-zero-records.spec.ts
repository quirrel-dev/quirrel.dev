import { addZeroRecords } from "./add-zero-records"

test("addZeroRecords", () => {
  expect(
    addZeroRecords([
      {
        invocations: 1,
        timestamp: new Date("2020-12-15T15:00:00.000Z"),
      },
      /* these two weren't recorded
    {
      invocations: 2,
      timestamp: new Date("2020-12-15T16:00:00.000Z")
    },
    {
      invocations: 3,
      timestamp: new Date("2020-12-15T17:00:00.000Z")
    },
    */
      {
        invocations: 4,
        timestamp: new Date("2020-12-15T18:00:00.000Z"),
      },
    ])
  ).toEqual([
    {
      invocations: 1,
      timestamp: new Date("2020-12-15T15:00:00.000Z"),
    },
    // so they're replaced with zeros
    {
      invocations: 0,
      timestamp: new Date("2020-12-15T16:00:00.000Z"),
    },
    {
      invocations: 0,
      timestamp: new Date("2020-12-15T17:00:00.000Z"),
    },
    {
      invocations: 4,
      timestamp: new Date("2020-12-15T18:00:00.000Z"),
    },
  ])
})
