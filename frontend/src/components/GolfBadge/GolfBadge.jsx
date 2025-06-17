import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as groupService from "../../services/groupService";
import "./GolfBadge.css";

export default function GolfBadge({ user }) {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [nextRound, setNextRound] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUpcomingRounds() {
      if (!user) return;
      
      try {
        const userGroups = await groupService.getUserGroups();
        
        const now = new Date();
        const upcomingRounds = [];
        
        userGroups.forEach(group => {
          if (group.outings) {
            group.outings.forEach(outing => {
              if (new Date(outing.date) >= now) {
                const userRsvpd = outing.players?.some(player => 
                  !player.cancelled && (player.userId === user._id || player.userId._id === user._id)
                );
                
                if (userRsvpd) {
                  upcomingRounds.push({
                    ...outing,
                    groupName: group.teamName,
                    groupId: group._id
                  });
                }
              }
            });
          }
        });

        upcomingRounds.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setUpcomingCount(upcomingRounds.length);
        setNextRound(upcomingRounds[0] || null);
        
      } catch (err) {
        console.error("Failed to fetch upcoming rounds:", err);
      }
    }

    fetchUpcomingRounds();
  }, [user]);

  if (!user || upcomingCount === 0) {
    return null;
  }

  function handleClick() {
    navigate("/schedule");
  }

  function isToday(date) {
    const today = new Date();
    const roundDate = new Date(date);
    return today.toDateString() === roundDate.toDateString();
  }

  function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const roundDate = new Date(date);
    return tomorrow.toDateString() === roundDate.toDateString();
  }

  return (
    <div 
      className="golf-badge-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button 
        className={`golf-badge ${isToday(nextRound?.date) ? 'today' : ''}`}
        onClick={handleClick}
        aria-label={`${upcomingCount} upcoming golf rounds`}
        title={`${upcomingCount} upcoming golf rounds`}
      >
        <span className="golf-icon">🏌️‍♂️</span>
        <span className="badge-count">{upcomingCount}</span>
      </button>

      {showTooltip && nextRound && (
        <div className="golf-tooltip">
          <div className="tooltip-header">
            <strong>Next Round</strong>
            {isToday(nextRound.date) && <span className="today-badge">Today!</span>}
            {isTomorrow(nextRound.date) && <span className="tomorrow-badge">Tomorrow</span>}
          </div>
          <div className="tooltip-content">
            <p className="course-name">{nextRound.courseName}</p>
            <p className="round-details">
              {new Date(nextRound.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })} at {nextRound.time}
            </p>
            <p className="group-name">{nextRound.groupName}</p>
          </div>
          {upcomingCount > 1 && (
            <div className="tooltip-footer">
              +{upcomingCount - 1} more round{upcomingCount - 1 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}