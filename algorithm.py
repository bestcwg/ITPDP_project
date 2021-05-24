import functional_dependencies as FD
from functional_dependencies.functional_dependencies import FDSet

#data = {"A","B","C","D","E","F","G","H","I","J"}

fd1 = FD.FD({"A","B"},{"C"})
fd2 = FD.FD({"A"},{"D","E"})
fd3 = FD.FD({"B"},{"F"})
fd4 = FD.FD({"F"},{"G","H"})
fd5 = FD.FD({"D"},{"I","J"})

data = {fd1, fd2, fd3, fd4, fd5}

fd1set = data

print(fd1set)

