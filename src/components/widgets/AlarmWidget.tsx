import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newAlarmTime, setNewAlarmTime] = useState("");

  const alarms = data?.alarms || [];

  const addAlarm = () => {
    if (!newAlarmTime) return;
    
    const newAlarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      enabled: true,
    };

    updateWidget(id, {
      data: {
        alarms: [...alarms, newAlarm],
      },
    });

    setNewAlarmTime("");
  };

  const removeAlarm = (alarmId: string) => {
    updateWidget(id, {
      data: {
        alarms: alarms.filter((alarm) => alarm.id !== alarmId),
      },
    });
  };

  const toggleAlarm = (alarmId: string) => {
    updateWidget(id, {
      data: {
        alarms: alarms.map((alarm) =>
          alarm.id === alarmId
            ? { ...alarm, enabled: !alarm.enabled }
            : alarm
        ),
      },
    });
  };

  if (!isDetailView) {
    return (
      <div className="text-sm text-gray-600">
        {alarms.length === 0
          ? "No alarms set"
          : `${alarms.length} alarm${alarms.length === 1 ? "" : "s"} set`}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="time"
          value={newAlarmTime}
          onChange={(e) => setNewAlarmTime(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addAlarm} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <button
              onClick={() => toggleAlarm(alarm.id)}
              className={`flex-1 text-left ${
                !alarm.enabled && "text-gray-400 line-through"
              }`}
            >
              {alarm.time}
            </button>
            <button
              onClick={() => removeAlarm(alarm.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}