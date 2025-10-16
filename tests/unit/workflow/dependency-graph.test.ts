// Tests for Dependency Graph Builder

import { describe, it, expect } from 'vitest';
import { DependencyGraphBuilder } from '../../../src/workflow/dependency-graph.js';
import { TASK_DEFINITIONS } from '../../../src/config/task-definitions.js';

describe('DependencyGraphBuilder', () => {

  describe('buildGraph', () => {
    it('should build a complete dependency graph', () => {
      const graph = DependencyGraphBuilder.buildGraph();

      expect(graph.nodes.size).toBeGreaterThan(0);
      expect(graph.edges.size).toBeGreaterThan(0);
      expect(graph.executionOrder.length).toBeGreaterThan(0);
    });

    it('should include all task definitions', () => {
      const graph = DependencyGraphBuilder.buildGraph();
      const taskIds = Object.keys(TASK_DEFINITIONS);

      taskIds.forEach(id => {
        expect(graph.nodes.has(id)).toBe(true);
      });
    });
  });

  describe('getReadyTasks', () => {
    it('should return tasks with no dependencies initially', () => {
      const graph = DependencyGraphBuilder.buildGraph();
      const completed = new Set<string>();

      const readyTasks = DependencyGraphBuilder.getReadyTasks(graph, completed);

      readyTasks.forEach(task => {
        expect(task.dependencies.length).toBe(0);
      });
    });

    it('should return tasks whose dependencies are completed', () => {
      const graph = DependencyGraphBuilder.buildGraph();
      const completed = new Set(['project-setup']);

      const readyTasks = DependencyGraphBuilder.getReadyTasks(graph, completed);

      readyTasks.forEach(task => {
        if (task.id !== 'project-setup') {
          task.dependencies.forEach(depId => {
            expect(completed.has(depId)).toBe(true);
          });
        }
      });
    });
  });

  describe('getAffectedTasks', () => {
    it('should find all tasks affected by a change', () => {
      const graph = DependencyGraphBuilder.buildGraph();

      // Stakeholder interviews should affect multiple downstream tasks
      const affected = DependencyGraphBuilder.getAffectedTasks(graph, 'stakeholder-interviews');

      expect(affected.length).toBeGreaterThan(0);
      expect(affected).toContain('brand-audit-report');
    });

    it('should handle tasks with no affected outputs', () => {
      const graph = DependencyGraphBuilder.buildGraph();

      const affected = DependencyGraphBuilder.getAffectedTasks(graph, 'executive-summary');

      // Executive summary is a final deliverable
      expect(affected.length).toBe(0);
    });
  });

  describe('validateDependencies', () => {
    it('should validate successfully for valid dependencies', () => {
      const result = DependencyGraphBuilder.validateDependencies();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getStatistics', () => {
    it('should return accurate statistics', () => {
      const graph = DependencyGraphBuilder.buildGraph();
      const stats = DependencyGraphBuilder.getStatistics(graph);

      expect(stats.totalTasks).toBe(Object.keys(TASK_DEFINITIONS).length);
      expect(stats.maxParallelism).toBeGreaterThan(0);
      expect(stats.criticalPathLength).toBeGreaterThan(0);
      expect(stats.averageDependencies).toBeGreaterThanOrEqual(0);
    });

    it('should have realistic parallelism', () => {
      const graph = DependencyGraphBuilder.buildGraph();
      const stats = DependencyGraphBuilder.getStatistics(graph);

      // Max parallelism should be reasonable (less than total tasks)
      expect(stats.maxParallelism).toBeLessThan(stats.totalTasks);
      expect(stats.maxParallelism).toBeGreaterThan(1);
    });
  });
});
