import { Outlet, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import { getAdminSectionKey } from "@/features/admin/config/admin-navigation";

const pageTransition = {
  duration: 0.25,
  ease: "easeOut" as const,
};

export function AdminPageTransition() {
  const sectionKey = useRouterState({
    select: (state) => getAdminSectionKey(state.location.pathname),
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Outlet />;
  }

  return (
    <motion.div
      key={sectionKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
      className="will-change-[opacity,transform]"
    >
      <Outlet />
    </motion.div>
  );
}
