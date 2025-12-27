// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/WcfClientBase.cs
// Purpose: Abstract base class for all WCF clients.
//          Manages channel creation, logging, and safe disposal of resources.
// ============================================================================

using System.ServiceModel;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// Abstract base for all WCF clients.
	/// Handles channel creation, logging, and safe disposal.
	/// </summary>
	/// <typeparam name="TChannel">WCF service interface type.</typeparam>
	public abstract class WcfClientBase<TChannel> : IDisposable where TChannel : class
	{
		private readonly ChannelFactory<TChannel> _channelFactory;
		private TChannel? _channel;
		protected readonly ILogger _logger;

		protected WcfClientBase(string endpointAddress, ILogger logger)
		{
			_logger = logger;

			var binding = new BasicHttpBinding
			{
				MaxReceivedMessageSize = int.MaxValue,
				MaxBufferSize = int.MaxValue,
				Security = new BasicHttpSecurity
				{
					Mode = BasicHttpSecurityMode.None
				}
			};

			_channelFactory = new ChannelFactory<TChannel>(
				binding,
				new EndpointAddress(endpointAddress)
			);
		}

		/// <summary>
		/// WCF channel for service calls.
		/// </summary>
		protected TChannel Channel
		{
			get
			{
				if (_channel == null)
				{
					_channel = _channelFactory.CreateChannel();
					((ICommunicationObject)_channel).Open();
				}

				return _channel;
			}
		}

		/// <summary>
		/// Safely disposes of the channel and ChannelFactory.
		/// </summary>
		public void Dispose()
		{
			if (_channel is ICommunicationObject comm)
			{
				try
				{
					if (comm.State == CommunicationState.Opened)
						comm.Close();
					else
						comm.Abort();
				}
				catch
				{
					comm.Abort();
				}
			}

			try
			{
				if (_channelFactory.State == CommunicationState.Opened)
					_channelFactory.Close();
			}
			catch
			{
				_channelFactory.Abort();
			}
		}
	}
}
