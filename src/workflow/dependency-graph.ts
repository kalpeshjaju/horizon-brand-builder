// Dependency Graph Builder - Analyzes task dependencies and determines execution order

import type { TaskDefinition, DependencyGraph } from '../types/adaptive-workflow-types.js';
import { TASK_DEFINITIONS } from '../config/task-definitions.js';

export class DependencyGraphBuilder {

  /**
   * Build complete dependency graph from task definitions
   */
  static buildGraph(): DependencyGraph {
    const nodes = new Map<string, TaskDefinition>();
    const edges = new Map<string, string[]>();

    // Build nodes
    Object.values(TASK_DEFINITIONS).forEach(task => {
      nodes.set(task.id, task);
      edges.set(task.id, []);
    });

    // Build edges (who depends on me?)
    Object.values(TASK_DEFINITIONS).forEach(task => {
      task.dependencies.forEach(depId => {
        const dependents = edges.get(depId) || [];
        dependents.push(task.id);
        edges.set(depId, dependents);
      });
    });

    // Calculate execution order (topological sort with batching)
    const executionOrder = this.calculateExecutionOrder(nodes, edges);

    return { nodes, edges, executionOrder };
  }

  /**
   * Calculate execution order in batches (tasks in same batch can run in parallel)
   */
  private static calculateExecutionOrder(
    nodes: Map<string, TaskDefinition>,
    edges: Map<string, string[]>
  ): string[][] {
    const batches: string[][] = [];
    const completed = new Set<string>();
    const inDegree = new Map<string, number>();

    // Calculate in-degree for each node
    nodes.forEach((task, id) => {
      inDegree.set(id, task.dependencies.length);
    });

    // Process batches
    while (completed.size < nodes.size) {
      const currentBatch: string[] = [];

      // Find all tasks with in-degree 0 (no pending dependencies)
      nodes.forEach((task, id) => {
        if (!completed.has(id) && inDegree.get(id) === 0) {
          currentBatch.push(id);
        }
      });

      if (currentBatch.length === 0) {
        // Circular dependency detected
        const remaining = Array.from(nodes.keys()).filter(id => !completed.has(id));
        throw new Error(
          `Circular dependency detected in tasks: ${remaining.join(', ')}`
        );
      }

      batches.push(currentBatch);

      // Mark batch as completed and update in-degrees
      currentBatch.forEach(id => {
        completed.add(id);

        // Decrease in-degree for dependent tasks
        const dependents = edges.get(id) || [];
        dependents.forEach(depId => {
          const currentDegree = inDegree.get(depId) || 0;
          inDegree.set(depId, currentDegree - 1);
        });
      });
    }

    return batches;
  }

  /**
   * Get tasks that can run right now (dependencies met)
   */
  static getReadyTasks(
    graph: DependencyGraph,
    completedTaskIds: Set<string>
  ): TaskDefinition[] {
    const ready: TaskDefinition[] = [];

    graph.nodes.forEach((task, id) => {
      // Skip if already completed
      if (completedTaskIds.has(id)) return;

      // Check if all dependencies are met
      const allDependenciesMet = task.dependencies.every(depId =>
        completedTaskIds.has(depId)
      );

      if (allDependenciesMet) {
        ready.push(task);
      }
    });

    return ready;
  }

  /**
   * Get all tasks that will be affected by a task update
   */
  static getAffectedTasks(
    graph: DependencyGraph,
    taskId: string
  ): string[] {
    const affected = new Set<string>();
    const visited = new Set<string>();

    const traverse = (currentId: string) => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      const task = graph.nodes.get(currentId);
      if (!task) return;

      // Add all affected outputs
      task.affectedOutputs.forEach(outputId => {
        affected.add(outputId);
        // Recursively find what those outputs affect
        traverse(outputId);
      });

      // Also traverse direct dependents
      const dependents = graph.edges.get(currentId) || [];
      dependents.forEach(depId => {
        affected.add(depId);
        traverse(depId);
      });
    };

    traverse(taskId);

    return Array.from(affected);
  }

  /**
   * Validate task dependencies (check for missing tasks, circular deps)
   */
  static validateDependencies(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const taskIds = new Set(Object.keys(TASK_DEFINITIONS));

    // Check for missing dependencies
    Object.values(TASK_DEFINITIONS).forEach(task => {
      task.dependencies.forEach(depId => {
        if (!taskIds.has(depId)) {
          errors.push(
            `Task "${task.id}" depends on unknown task "${depId}"`
          );
        }
      });

      // Check for self-dependency
      if (task.dependencies.includes(task.id)) {
        errors.push(
          `Task "${task.id}" depends on itself (circular dependency)`
        );
      }
    });

    // Try to build graph (will throw on circular dependencies)
    try {
      this.buildGraph();
    } catch (error) {
      errors.push((error as Error).message);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get execution statistics
   */
  static getStatistics(graph: DependencyGraph): {
    totalTasks: number;
    maxParallelism: number;
    criticalPathLength: number;
    averageDependencies: number;
  } {
    const totalTasks = graph.nodes.size;
    const maxParallelism = Math.max(...graph.executionOrder.map(batch => batch.length));
    const criticalPathLength = graph.executionOrder.length;

    let totalDeps = 0;
    graph.nodes.forEach(task => {
      totalDeps += task.dependencies.length;
    });
    const averageDependencies = totalDeps / totalTasks;

    return {
      totalTasks,
      maxParallelism,
      criticalPathLength,
      averageDependencies
    };
  }
}
