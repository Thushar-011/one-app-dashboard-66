import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Widget as WidgetType } from "@/types/widget";
import AlarmWidget from "./widgets/AlarmWidget";
import TodoWidget from "./widgets/TodoWidget";
import NoteWidget from "./widgets/NoteWidget";
import ReminderWidget from "./widgets/ReminderWidget";
import ExpenseWidget from "./widgets/ExpenseWidget";
import { Button } from "./ui/button";
import WidgetHeader from "./widgets/WidgetHeader";

export default function Widget({ id, type, position, size, data }: WidgetType) {
  const { editMode, updateWidget, removeWidget } = useWidgets();
  const [isDragging, setIsDragging] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);

  const renderWidgetContent = () => {
    switch (type) {
      case "alarm":
        return <AlarmWidget id={id} data={data} isDetailView={isDetailView} />;
      case "todo":
        return <TodoWidget id={id} data={data} isDetailView={isDetailView} />;
      case "note":
        return <NoteWidget id={id} data={data} isDetailView={isDetailView} />;
      case "reminder":
        return <ReminderWidget id={id} data={data} isDetailView={isDetailView} />;
      case "expense":
        return <ExpenseWidget id={id} data={data} isDetailView={isDetailView} />;
      default:
        return <div>Widget type not implemented yet</div>;
    }
  };

  return (
    <>
      <motion.div
        className="widget absolute"
        style={{
          width: size.width,
          height: size.height,
        }}
        initial={{ 
          x: position.x,
          y: position.y,
          scale: 0.8,
          opacity: 0 
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isDragging ? 1.05 : 1,
          opacity: 1
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        drag={editMode}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          updateWidget(id, {
            position: {
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            },
          });
        }}
        onClick={() => !editMode && setIsDetailView(!isDetailView)}
        whileHover={{ scale: editMode ? 1 : 1.02 }}
      >
        <div className="widget-content">
          <WidgetHeader
            type={type}
            editMode={editMode}
            onDelete={(e) => {
              e.stopPropagation();
              removeWidget(id);
            }}
          />
          {renderWidgetContent()}
        </div>
      </motion.div>

      <AnimatePresence>
        {isDetailView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-background overflow-auto"
            >
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 mb-4">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDetailView(false)}
                      className="shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <WidgetHeader
                      type={type}
                      editMode={editMode}
                      onDelete={(e) => {
                        e.stopPropagation();
                        removeWidget(id);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="max-w-2xl mx-auto p-4">
                {renderWidgetContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}