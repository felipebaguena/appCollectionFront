'use client';

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { DateFormat } from '../../types/date';

const CalendarContainer = styled.div`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 280px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthYearDisplay = styled.div`
  font-weight: 600;
  color: var(--dark-grey);
  display: flex;
  gap: 8px;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dark-grey);
  font-weight: 600;
  padding: 4px 8px;
  
  &:hover {
    background: var(--light-grey);
  }
`;

const YearButton = styled(MonthButton)``;

const NavigationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  
  &:hover {
    background: var(--light-grey);
  }
`;

const WeekDaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--dark-grey);
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = styled.button<{
    $isToday?: boolean;
    $isSelected?: boolean;
    $isCurrentMonth: boolean;
    $isDisabled?: boolean;
}>`
  aspect-ratio: 1;
  border: none;
  background: ${props => props.$isSelected ? 'var(--app-yellow)' : 'none'};
  color: ${props => {
        if (props.$isSelected) return 'var(--dark-grey)';
        if (!props.$isCurrentMonth) return 'var(--clear-grey)';
        return 'var(--cancel-grey)';
    }};
  font-weight: ${props => props.$isCurrentMonth ? '500' : '400'};
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
  
  ${props => props.$isToday && `
    border: 2px solid var(--mid-grey);
  `}

  &:hover {
    background: ${props =>
        props.$isSelected
            ? 'var(--app-yellow-focus)'
            : 'var(--clear-grey)'
    };
  }

  ${props => props.$isDisabled && `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const Dropdown = styled.div`
  position: absolute;
  background: var(--background);
  border: 1px solid var(--border-color);
  max-height: 200px;
  overflow-y: auto;
  z-index: 20;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: ${props => props.$isSelected ? 'var(--app-yellow)' : 'var(--background)'};
  cursor: pointer;
  text-align: left;
  color: var(--dark-grey);
  
  &:hover {
    background: ${props => props.$isSelected ? 'var(--app-yellow-focus)' : 'var(--clear-grey)'};
  }
`;

const TimeInputContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`;

const TimeInput = styled.input`
    width: 5rem;
    padding: 6px 24px 6px 6px;
    text-align: left;
    border: 1px solid var(--clear-grey);
    font-size: 14px;
    
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &:focus {
        outline: none;
        border-color: var(--app-yellow);
        border-radius: 0;
    }
`;

const TimeControls = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 2rem;
`;

const TimeButton = styled.button`
    padding: 0;
    height: 50%;
    border: 1px solid var(--clear-grey);
    background: transparent;
    color: var(--mid-grey);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;

    &:hover,
    &:active {
        background-color: var(--app-yellow);
        color: var(--dark-grey);
    }
`;

const TimeContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
    align-items: center;
    padding: 0 8px;
`;

const TimeSeparator = styled.span`
  color: var(--dark-grey);
  font-weight: 500;
`;

interface CalendarProps {
    selectedDate: Date | null;
    onChange: (date: Date) => void;
    onClose?: () => void;
    dateFormat?: DateFormat;
    hasTime?: boolean;
    disablePastDates?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onChange, onClose, dateFormat, hasTime = false, disablePastDates = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [hours, setHours] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                onClose?.();
                setShowMonthDropdown(false);
                setShowYearDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Modificamos la generación de años
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 1970;
        const years: number[] = [];

        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }

        return years.reverse(); // Los ordenamos de más reciente a más antiguo
    };

    const years = generateYears();

    const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return selectedDate?.getDate() === date.getDate() &&
            selectedDate?.getMonth() === date.getMonth() &&
            selectedDate?.getFullYear() === date.getFullYear();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const daysArray = [];

        // Días del mes anterior
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i);
            daysArray.push(
                <DayCell
                    key={`prev-${i}`}
                    onClick={() => !isDateDisabled(date) && onChange(date)}
                    $isCurrentMonth={false}
                    $isSelected={isSelected(date)}
                    $isDisabled={isDateDisabled(date)}
                    disabled={isDateDisabled(date)}
                >
                    {daysInPrevMonth - i}
                </DayCell>
            );
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            daysArray.push(
                <DayCell
                    key={i}
                    onClick={() => !isDateDisabled(date) && onChange(date)}
                    $isToday={isToday(date)}
                    $isSelected={isSelected(date)}
                    $isCurrentMonth={true}
                    $isDisabled={isDateDisabled(date)}
                    disabled={isDateDisabled(date)}
                >
                    {i}
                </DayCell>
            );
        }

        // Días del mes siguiente
        const remainingDays = 42 - daysArray.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
            daysArray.push(
                <DayCell
                    key={`next-${i}`}
                    onClick={() => !isDateDisabled(date) && onChange(date)}
                    $isCurrentMonth={false}
                    $isSelected={isSelected(date)}
                    $isDisabled={isDateDisabled(date)}
                    disabled={isDateDisabled(date)}
                >
                    {i}
                </DayCell>
            );
        }

        return daysArray;
    };

    const isDateDisabled = (date: Date) => {
        if (!disablePastDates) return false;
        const now = new Date();
        return date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    };

    const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
        const numValue = parseInt(value) || 0;
        const now = new Date();

        if (type === 'hours') {
            let validHours = Math.min(Math.max(numValue, 0), 23);

            if (disablePastDates && selectedDate &&
                selectedDate.getDate() === now.getDate() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getFullYear() === now.getFullYear()) {
                validHours = Math.max(validHours, now.getHours());
                if (validHours === now.getHours()) {
                    setMinutes(Math.max(minutes, now.getMinutes()));
                }
            }

            setHours(validHours);
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setHours(validHours);
                onChange(newDate);
            }
        } else {
            let validMinutes = Math.min(Math.max(numValue, 0), 59);

            if (disablePastDates && selectedDate &&
                selectedDate.getDate() === now.getDate() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getFullYear() === now.getFullYear() &&
                hours === now.getHours()) {
                validMinutes = Math.max(validMinutes, now.getMinutes());
            }

            setMinutes(validMinutes);
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setMinutes(validMinutes);
                onChange(newDate);
            }
        }
    };

    const handleDateChange = (date: Date) => {
        const newDate = new Date(date);
        if (hasTime) {
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
        }
        onChange(newDate);
    };

    return (
        <CalendarContainer ref={calendarRef}>
            <CalendarHeader>
                <NavigationButton onClick={handlePrevMonth}>&lt;</NavigationButton>
                <MonthYearDisplay>
                    <MonthButton onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
                        {months[currentDate.getMonth()]}
                    </MonthButton>
                    <YearButton onClick={() => setShowYearDropdown(!showYearDropdown)}>
                        {currentDate.getFullYear()}
                    </YearButton>
                </MonthYearDisplay>
                <NavigationButton onClick={handleNextMonth}>&gt;</NavigationButton>
            </CalendarHeader>

            {showMonthDropdown && (
                <Dropdown>
                    {months.map((month, index) => (
                        <DropdownItem
                            key={month}
                            $isSelected={index === currentDate.getMonth()}
                            onClick={() => {
                                setCurrentDate(new Date(currentDate.getFullYear(), index));
                                setShowMonthDropdown(false);
                            }}
                        >
                            {month}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}

            {showYearDropdown && (
                <Dropdown>
                    {years.map(year => (
                        <DropdownItem
                            key={year}
                            $isSelected={year === currentDate.getFullYear()}
                            onClick={() => {
                                setCurrentDate(new Date(year, currentDate.getMonth()));
                                setShowYearDropdown(false);
                            }}
                        >
                            {year}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}

            <WeekDaysContainer>
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </WeekDaysContainer>
            <DaysGrid>
                {renderDays()}
            </DaysGrid>

            {hasTime && (
                <TimeContainer>
                    <TimeInputContainer>
                        <TimeInput
                            type="number"
                            min="0"
                            max="23"
                            value={hours}
                            onChange={(e) => handleTimeChange('hours', e.target.value)}
                            placeholder="HH"
                        />
                        <TimeControls>
                            <TimeButton
                                onClick={() => handleTimeChange('hours', (hours + 1).toString())}
                            >
                                ▲
                            </TimeButton>
                            <TimeButton
                                onClick={() => handleTimeChange('hours', (hours - 1).toString())}
                            >
                                ▼
                            </TimeButton>
                        </TimeControls>
                    </TimeInputContainer>
                    <TimeSeparator>:</TimeSeparator>
                    <TimeInputContainer>
                        <TimeInput
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => handleTimeChange('minutes', e.target.value)}
                            placeholder="MM"
                        />
                        <TimeControls>
                            <TimeButton
                                onClick={() => handleTimeChange('minutes', (minutes + 1).toString())}
                            >
                                ▲
                            </TimeButton>
                            <TimeButton
                                onClick={() => handleTimeChange('minutes', (minutes - 1).toString())}
                            >
                                ▼
                            </TimeButton>
                        </TimeControls>
                    </TimeInputContainer>
                </TimeContainer>
            )}
        </CalendarContainer>
    );
};

export default Calendar; 