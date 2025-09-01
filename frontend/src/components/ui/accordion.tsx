"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

// Root Accordion component
const Accordion = AccordionPrimitive.Root;

// Individual Accordion Item
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} {...props} className="border-b">
    {children}
  </AccordionPrimitive.Item>
));
AccordionItem.displayName = "AccordionItem";

// Accordion Trigger (clickable header)
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className="flex-1 text-left py-2 px-4 font-medium hover:bg-gray-100"
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content (expandable body)
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="px-4 pb-4 pt-2"
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
