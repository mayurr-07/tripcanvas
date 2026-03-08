import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Clock3, GripVertical, MapPin, MessageSquare } from "lucide-react";
import { cn } from "../utils/cn";
import type { Activity } from "../types/app";

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onSelect: () => void;
}

export function ActivityCard({ activity, index, onSelect }: ActivityCardProps) {
  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={onSelect}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className={cn(
              "w-full rounded-xl border bg-white p-5 text-left shadow-[0_20px_44px_-30px_rgba(15,23,42,0.34)] transition",
              snapshot.isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_30px_80px_-30px_rgba(244,162,97,0.65)]" : "border-slate-200"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.notes}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                    {activity.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[var(--accent)]" />
                    {activity.comments.length} comments
                  </span>
                </div>
              </div>
              <span className="rounded-xl bg-slate-100 p-3 text-slate-400">
                <GripVertical className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}