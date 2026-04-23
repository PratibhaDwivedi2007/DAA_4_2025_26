#include <bits/stdc++.h>
using namespace std;

int lowerBound(vector<int>& arr, int t)
{
    int low = 0, high = arr.size() - 1;
    int ans = arr.size();

    while (low <= high)
    {
        int mid = low + (high - low) / 2;

        if (arr[mid] >= t)
        {
            ans = mid;
            high = mid - 1;
        }
        else
        {
            low = mid + 1;
        }
    }
    return ans;
}

int upperBound(vector<int>& arr, int t)
{
    int low = 0, high = arr.size() - 1;
    int ans = arr.size();

    while (low <= high)
    {
        int mid = low + (high - low) / 2;

        if (arr[mid] > t)
        {
            ans = mid;
            high = mid - 1;
        }
        else
        {
            low = mid + 1;
        }
    }
    return ans;
}

int main()
{
    int n,m;
    cout << "enter the size of the first array: ";
    cin >> n;
    cout << "enter the size of the second array: ";
    cin >> m;


    vector<int> arr1(n);
    for (int i = 0; i < n; i++)
    {
        cin >> arr1[i];
    }
    vector<int> arr2(m);
    for (int i = 0; i < m; i++)
    {
        cin >> arr2[i];
    }

    sort(arr2.begin(),arr2.end());
    int tsum=0;
    cout << "enter the target sum : ";
    cin >> tsum;
    int count;
    for(int i=0;i<n;i++)
    {
        int x=tsum-arr1[i];
        int l=lowerBound(arr2,x);
        int u=upperBound(arr2,x);
        count+=u-l;
    }
    cout<<"the number of pairs are  : "<<count<<endl;
    return 0;
}