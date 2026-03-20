import { Card, CardContent } from "@repo/ui/components/card";
import React from "react";

export default function MeetingStatus() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="bg-base-100 border border-base-300 shadow">
        <CardContent className="p-6 text-center text-base-content">
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-base-content/60">Meetings Hosted</p>
        </CardContent>
      </Card>

      <Card className="bg-base-100 border border-base-300 shadow">
        <CardContent className="p-6 text-center text-base-content">
          <p className="text-3xl font-bold">68</p>
          <p className="text-sm text-base-content/60">Meetings Joined</p>
        </CardContent>
      </Card>

      <Card className="bg-base-100 border border-base-300 shadow text-base-content">
        <CardContent className="p-6 text-center">
          <p className="text-3xl font-bold">134h</p>
          <p className="text-sm text-base-content/60">Meeting Time</p>
        </CardContent>
      </Card>
    </div>
  );
}
