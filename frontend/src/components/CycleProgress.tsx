import { useMemo } from 'react';
import { Badge } from './Badge';
import './CycleProgress.css';

export interface CycleProgressProps {
  cycleNumber: number;
  deadline: Date;
  contributedCount: number;
  totalMembers: number;
  targetAmount: number;
  currentAmount?: number;
  status?: 'active' | 'completed' | 'pending';
}

export function CycleProgress({
  cycleNumber,
  deadline,
  contributedCount,
  totalMembers,
  targetAmount,
  currentAmount = 0,
  status = 'active',
}: CycleProgressProps) {
  const timeRemaining = useMemo(() => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m`;
  }, [deadline]);

  const contributionProgress = (contributedCount / totalMembers) * 100;
  const amountProgress = (currentAmount / targetAmount) * 100;
  const isOverdue = new Date() > deadline;

  return (
    <div className={`cycle-progress cycle-progress--${status}`}>
      <div className="cycle-progress-header">
        <div className="cycle-progress-title">
          <h3>Cycle {cycleNumber}</h3>
          <Badge variant={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'info'}>
            {status}
          </Badge>
        </div>
        <div className={`cycle-progress-time ${isOverdue ? 'overdue' : ''}`}>
          <span className="time-label">Time Remaining:</span>
          <span className="time-value">{timeRemaining}</span>
        </div>
      </div>

      <div className="cycle-progress-stats">
        <div className="stat">
          <span className="stat-label">Contributions</span>
          <span className="stat-value">{contributedCount}/{totalMembers}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Amount</span>
          <span className="stat-value">{currentAmount.toLocaleString()} XLM</span>
        </div>
        <div className="stat">
          <span className="stat-label">Target</span>
          <span className="stat-value">{targetAmount.toLocaleString()} XLM</span>
        </div>
      </div>

      <div className="cycle-progress-bars">
        <div className="progress-item">
          <div className="progress-header">
            <span>Contribution Progress</span>
            <span className="progress-percentage">{contributionProgress.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(contributionProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-header">
            <span>Amount Progress</span>
            <span className="progress-percentage">{amountProgress.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-fill--amount" 
              style={{ width: `${Math.min(amountProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {contributionProgress === 100 && (
        <div className="cycle-progress-complete">
          ✓ All members have contributed
        </div>
      )}
    </div>
  );
}
