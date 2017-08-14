import operator as op
def ncr(n, r):
    r = min(r, n-r)
    if r == 0: return 1
    numer = reduce(op.mul, xrange(n, n-r, -1))
    denom = reduce(op.mul, xrange(1, r+1))
    return numer//denom
    
import math as math

def nCr(n,r):
    f = math.factorial
    return f(n) / f(r) / f(n-r)

"""
How many possible combinations are there when sampling n observations from a population size = N with two groups A and B with population proportions = p and (1 - p) and sample has x A's and (n - x) B's?
"""
def scombs(x, n, p, N):
  c1 = ncr(round((N * p), 0), x)
  c2 = ncr(round((N * (1-p)), 0), (n-x))
  return c1 * c2

def jprob(x, n, p, N):
  N_As = round(N * p)
  pr_x = N_As / N;
  for i in range(1, (n - 1)):
    pr_x = pr_x * (min(0, (N_As - i)) / (N - i));
  return round(pr_x,4)
    
def sample_prob(x, n, p, N):
  N_As = round(N * p)
  N_Bs = N - N_As
  c_match = 0;
  c_total = 0;
  for i in range(0, min(n, N_As)):
    c = scombs(i, n, p, N)
    c_total = c_total + c
    if (i < x):
      c_match = c_match + c
  return round((c_match/c_total), 2)
  
# Monkey test
sample_prob(40, 100, 0.5, 1000)