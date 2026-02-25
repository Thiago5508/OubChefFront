import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Order, OrderService } from '../../services/home.services/order.service';
import { Item,ListItem } from '../../services/home.services/listItem.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  loading: WritableSignal<boolean> = signal(true);
  orders: WritableSignal<Order[]> = signal([]);
  expandedOrderId = signal<string | null>(null);
  itemsByOrder = signal<Record<string, Item[]>>({});

  
  constructor(
    private router: Router, 
    private auth: Auth,
    private orderService: OrderService,
    private itemService: ListItem,
) {}

  ngOnInit() {
    this.fetchOrders();
  }
  fetchOrders(active?: boolean, startDate?: string, endDate?: string) {
    this.loading.set(true);

    const filters = {
      active,
      startDate,
      endDate
    };

    this.orderService.getOrders(filters).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
  
  loadItems(orderId: string) {
  if (this.itemsByOrder()[orderId]) return;

  this.itemService.getItem(orderId).subscribe({
    next: (items) => {
      this.itemsByOrder.update((current) => ({
        ...current,
        [orderId]: items
      }));
    },
    error: (err) => {
      console.error('Erro ao buscar itens', err);
    }
  });
}


  toggleOrder(orderId: string) {
    this.expandedOrderId.update((current) =>
      current === orderId ? null : orderId
    );
     if (this.expandedOrderId() === orderId) {
    this.loadItems(orderId);
    }
  }

  getOrderTotal(orderId: string): number {
    const items = this.itemsByOrder()[orderId];

    if (!items) return 0;

    return items.reduce((total, item) => {
      return total + Number(item.price * (item.quantity ?? 1));
    }, 0);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loading.set(true);
    this.expandedOrderId.set(null);
    this.itemsByOrder.set({});
    this.fetchOrders();
  }

}