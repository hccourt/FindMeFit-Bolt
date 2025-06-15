import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';
import { Class } from '../../lib/types';
import { useLocationStore } from '../../lib/store';

interface ClassCardProps {
  classItem: Class;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
  const { regionSettings: currentRegion } = useLocationStore();
  
  const {
    id,
    title,
    instructor,
    location,
    startTime,
    endTime,
    price,
    maxParticipants,
    currentParticipants,
    type,
    level,
    tags,
    imageUrl,
    isBooked,
  } = classItem;
  
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const spotsLeft = maxParticipants - currentParticipants;
  const isFull = spotsLeft === 0;
  
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-medium dark:hover:shadow-none dark:hover:border-primary/50">
      <Link to={`/classes/${id}`} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={imageUrl || 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant={type === 'personal' ? 'primary' : 'default'}>
              {type === 'personal' ? 'Personal Training' : 'Group Class'}
            </Badge>
            {isBooked && (
              <Badge variant="success">Booked</Badge>
            )}
            <Badge variant={isFull ? 'error' : 'success'}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </Badge>
          </div>
        </div>
        
        <CardContent className="flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold line-clamp-1 text-card-foreground">{title}</h3>
            <span className="font-semibold text-primary">{formatCurrency(price, currentRegion)}</span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDate(startDate, currentRegion.dateLocale)} • {formatTime(startDate, currentRegion.dateLocale)} - {formatTime(endDate, currentRegion.dateLocale)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {location.name}, {location.city}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {currentParticipants}/{maxParticipants} participants
            </span>
          </div>
          
          <div className="mt-auto flex items-center pt-3 border-t border-border">
            <Avatar
              src={instructor.profileImage}
              name={instructor.name}
              size="sm"
            />
            <div className="ml-2">
              <p className="text-sm font-medium text-card-foreground">{instructor.name}</p>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  ★ {instructor.rating} ({instructor.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};