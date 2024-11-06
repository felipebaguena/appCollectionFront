'use client';

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';

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

const DayCell = styled.button<{ $isToday?: boolean; $isSelected?: boolean; $isCurrentMonth: boolean }>`
  aspect-ratio: 1;
  border: none;
  background: ${props => props.$isSelected ? 'var(--app-yellow)' : 'none'};
  color: ${props => {
        if (props.$isSelected) return 'var(--dark-grey)';
        if (!props.$isCurrentMonth) return 'var(--mid-grey)';
        return 'var(--dark-grey)';
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

interface CalendarProps {
    selectedDate: Date | null;
    onChange: (date: Date) => void;
    onClose?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onChange, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
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
                    onClick={() => onChange(date)}
                    $isCurrentMonth={false}
                    $isSelected={isSelected(date)}
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
                    onClick={() => onChange(date)}
                    $isToday={isToday(date)}
                    $isSelected={isSelected(date)}
                    $isCurrentMonth={true}
                >
                    {i}
                </DayCell>
            );
        }

        // Días del mes siguiente
        const remainingDays = 42 - daysArray.length; // 6 semanas x 7 días
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
            daysArray.push(
                <DayCell
                    key={`next-${i}`}
                    onClick={() => onChange(date)}
                    $isCurrentMonth={false}
                    $isSelected={isSelected(date)}
                >
                    {i}
                </DayCell>
            );
        }

        return daysArray;
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
        </CalendarContainer>
    );
};

export default Calendar; 