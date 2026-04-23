#include<bits/stdc++.h>
using namespace std;
class Solution {
  public:
    
    bool canPaint(vector<int>& arr, int k, int maxTime) {
        int painters = 1;
        long long currTime = 0;

        for (int len : arr) {
            if (currTime + len <= maxTime) {
                currTime += len;
            } else {
                painters++;
                currTime = len;
            }
        }
        return painters <= k;
    }

    int minTime(vector<int>& arr, int k) {
        int low = *max_element(arr.begin(), arr.end());
        long long high = 0;

        for (int x : arr) high += x;

        long long ans = high;

        while (low <= high) {
            long long mid = low + (high - low) / 2;

            if (canPaint(arr, k, mid)) {
                ans = mid;        
                high = mid - 1;   
            } else {
                low = mid + 1;  
            }
        }
        return ans;
    }
};