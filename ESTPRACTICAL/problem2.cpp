#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    Node(int val) {
        data = val;
        next = NULL;
    }
};

class Queue {
    Node *front, *rear;
    int count;

public:
    Queue() {
        front = rear = NULL;
        count = 0;
    }

    
    void enqueue(int x) {
        Node* newNode = new Node(x);

        if (rear == NULL) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }

        count++;
        cout << x << " enqueued\n";
    }

    
    void dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow\n";
            return;
        }

        Node* temp = front;
        cout << front->data << " dequeued\n";
        front = front->next;

        if (front == NULL)
            rear = NULL;

        delete temp;
        count--;
    }

   
    void peek() {
        if (isEmpty()) {
            cout << "Queue is empty\n";
            return;
        }
        cout << "Front element: " << front->data << endl;
    }

    
    bool isEmpty() {
        return front == NULL;
    }

    int size() {
        return count;
    }
};

int main() {
    Queue q;

    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);

    q.peek();              
    cout << "Size: " << q.size() << endl;

    q.dequeue();
    q.dequeue();

    cout << "Size: " << q.size() << endl;

    q.dequeue();
    q.dequeue();          

    return 0;
}