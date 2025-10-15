---
marp: true
theme: default
paginate: true
---

# Simulation Overview
- What is simulation?
- Some Examples
- Key components of a simulation
- Deterministic vs. Stochastic simulations
- When are simulations useful?

---

# What is Simulation?
- A way to gain insight into the behavior of complicated systems.
    - Create a simplified representation (a model) of a real-world process   
    - Execute that model to generate synthetic dataset
        - Execute many times to see a range of possible outcomes, if the model is stochastic
        - Execute with different model parameters to see how outcomes change
    - Analyze and visualize the synthetic dataset to understand the system better
- Widely used in fields such as engineering, economics, healthcare, and social sciences. 

---

# Common Simulation Types
- **Queueing Models**: Simulate customer arrivals and service times to optimize staffing and reduce wait times.
- **Traffic Flow**: Model vehicle movements to improve road designs and traffic light timings.
- **Epidemiological Models**: Simulate disease spread to inform public health interventions.
- **Financial Models**: Simulate market scenarios to assess investment risks and returns.
- **Manufacturing Processes**: Model production lines to identify bottlenecks and improve efficiency.

---
# Some Examples

- [Traffic Simulator (Roundabout Example)](https://traffic-simulation.de/roundabout.html)
- [Weaving Simulator](https://gistyarn.netlify.app/) (password-protected)
- [Community Notes Algorithm Simulator](https://csmr.umich.edu/projects/cn/notetutorial/?noteID=1878343473117737139)
    - in this case, we are simulating the algorithm's output after each additional user vote
    - running the actual algorithm takes almost a day on a powerful server
    - so we make a simplifying assumption that allows calculation in milliseconds, with some loss of accuracy
- Tennis Match Simulator (`tennis_simulator.ipynb` notebook we'll explore)

---
# Deterministic vs. Stochastic Simulations
- **Deterministic Simulations**:
    - No randomness involved.
    - Same input parameters always yield the same output.
    - Example: Weaving pattern simulator.
- **Stochastic Simulations**:
    - Incorporate randomness and probability distributions.
    - Same input parameters can yield different outputs on different runs.
    - Examples: Tennis match simulator, traffic flow models.

---
# Key Components of a Simulation
1. **Computable Model**: A simplified representation of the real-world system, defined by rules and parameters.
2. **Model Execution as Data Generator**: Running the model to produce synthetic data
    - Multiple times with different parameter values
    - Multiple times to capture variability due to randomness
3. **Analysis and Visualization**: Examining the synthetic data to gain insights into the system's behavior.


---
# When are Simulations Useful?
- To explore what-if scenarios about the effects of different conditions.
- To understand variability and uncertainty in outcomes
    - mean; variance; worst-case; best-case

---
# Alternatives to Simulations
- Real-world experiments
  - When feasible, usually preferable to simulations
    - But only if the experiment conditions match the real-world conditions of interest
  - Often impractical, costly, or unethical
- Analytic models
  - When the model is simple enough to be described by mathematical equations and outcomes can be "solved for" via algebra or calculus
  - More precise than simulations
  - But requires simpler models than simulations can handle, less faithful to real-world systems