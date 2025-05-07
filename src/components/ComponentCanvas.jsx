import React from 'react';

const ComponentCanvas = ({ components }) => {
  return (
    <div className="w-full h-[400px] border border-gray-300 rounded-md bg-gray-50 p-2 overflow-auto flex flex-wrap gap-4">
      {components.map((comp, idx) => {
        const TagName = comp.tag;
        return <TagName key={comp.id} id={comp.id} />;
      })}
    </div>
  );
};

export default ComponentCanvas;
