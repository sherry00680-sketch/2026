
import { ReactNode } from 'react';

export interface FlightInfo {
  no: string;
  route: string;
  terminal: string;
}

export interface ItineraryStep {
  time: string;
  task: string;
}

export interface ItineraryItem {
  day: string;
  date: string;
  title: string;
  icon: ReactNode;
  category: string[];
  color: string;
  bgUrl: string;
  detail: string;
  mapQuery: string;
  flightInfo?: FlightInfo;
  extendedDetail: ItineraryStep[];
  memo: string;
}

export interface ExpenseItem {
  id: number;
  title: string;
  val: number;
}

export interface ShoppingItem {
  id: number;
  name: string;
  store: string;
  jpy: number;
  bought: boolean;
}

export type TabType = 'itinerary' | 'packing' | 'exchange' | 'shopping' | 'info';
